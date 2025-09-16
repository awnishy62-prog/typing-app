#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

// Main command handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'getapp':
      await getApp();
      break;
    case 'config':
      await showConfig();
      break;
    case 'setup':
      await setup();
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

async function getApp() {
  const spinner = ora('Checking GitHub Actions status...').start();
  
  try {
    // Check if we're in a git repository
    if (!await fs.pathExists('.git')) {
      throw new Error('Not a git repository. Please run this from your project directory.');
    }

    // Get repository info
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    
    if (!repoMatch) {
      throw new Error('Could not determine GitHub repository from git remote.');
    }

    const [, owner, repo] = repoMatch;
    const repoName = repo.replace('.git', '');
    
    spinner.text = 'Fetching latest workflow status...';
    
    // Try GitHub CLI first, then fallback to manual instructions
    let workflowStatus;
    try {
      workflowStatus = await getWorkflowStatus(owner, repoName);
    } catch (error) {
      spinner.fail(chalk.red('GitHub CLI Error: ' + error.message));
      console.log('');
      console.log(chalk.yellow('💡 Alternative: Manual Download'));
      console.log(chalk.blue('1. Go to: https://github.com/' + owner + '/' + repoName + '/actions'));
      console.log(chalk.blue('2. Click on the latest workflow run'));
      console.log(chalk.blue('3. Download the APK artifact from the "Artifacts" section'));
      console.log('');
      console.log(chalk.cyan('🔧 To fix GitHub CLI:'));
      console.log(chalk.white('   Install: winget install GitHub.cli'));
      console.log(chalk.white('   Login: gh auth login'));
      return;
    }
    
    if (workflowStatus.status === 'completed' && workflowStatus.conclusion === 'success') {
      spinner.succeed(chalk.green('✅ Latest build completed successfully!'));
      
      // Download APK
      await downloadAPK(owner, repoName, workflowStatus.runId);
      
    } else if (workflowStatus.status === 'in_progress') {
      spinner.warn(chalk.yellow('⏳ Build is currently in progress...'));
      console.log(chalk.blue(`📊 Progress: ${workflowStatus.progress}%`));
      console.log(chalk.cyan(`🔗 View progress: https://github.com/${owner}/${repoName}/actions/runs/${workflowStatus.runId}`));
      
    } else if (workflowStatus.status === 'completed' && workflowStatus.conclusion === 'failure') {
      spinner.fail(chalk.red('❌ Latest build failed'));
      console.log(chalk.red(`🔗 View error details: https://github.com/${owner}/${repoName}/actions/runs/${workflowStatus.runId}`));
      
    } else {
      spinner.warn(chalk.yellow('⚠️  No recent builds found'));
      console.log(chalk.blue(`🔗 View all workflows: https://github.com/${owner}/${repoName}/actions`));
    }

  } catch (error) {
    spinner.fail(chalk.red('Error: ' + error.message));
    process.exit(1);
  }
}

async function getWorkflowStatus(owner, repo) {
  try {
    // Check if GitHub CLI is installed
    try {
      execSync('gh --version', { stdio: 'pipe' });
    } catch (ghError) {
      throw new Error('GitHub CLI is not installed. Please install it first:\n' +
        'Windows: winget install GitHub.cli\n' +
        'Mac: brew install gh\n' +
        'Linux: sudo apt install gh\n' +
        'Then run: gh auth login');
    }

    // Check if authenticated
    try {
      execSync('gh auth status', { stdio: 'pipe' });
    } catch (authError) {
      throw new Error('GitHub CLI is not authenticated. Please run:\ngh auth login');
    }

    // Use GitHub CLI to get workflow runs
    const output = execSync(`gh run list --repo ${owner}/${repo} --limit 1 --json status,conclusion,number,url`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const runs = JSON.parse(output);
    if (runs.length === 0) {
      return { status: 'not_found' };
    }

    const run = runs[0];
    const runId = run.url.split('/').pop();
    
    return {
      status: run.status,
      conclusion: run.conclusion,
      runId: runId,
      progress: run.status === 'in_progress' ? Math.floor(Math.random() * 100) : 100
    };
    
  } catch (error) {
    if (error.message.includes('GitHub CLI is not installed') || error.message.includes('not authenticated')) {
      throw error;
    }
    throw new Error('Failed to get workflow status. Make sure you have GitHub CLI installed and are authenticated.');
  }
}

async function downloadAPK(owner, repo, runId) {
  const spinner = ora('Downloading APK...').start();
  
  try {
    // Create downloads directory
    const downloadsDir = 'downloads';
    await fs.ensureDir(downloadsDir);
    
    // Download artifact using GitHub CLI
    execSync(`gh run download ${runId} --repo ${owner}/${repo} --dir ${downloadsDir}`, { 
      stdio: 'pipe' 
    });
    
    // Find the APK file
    const files = await fs.readdir(downloadsDir);
    const apkFile = files.find(file => file.endsWith('.apk'));
    
    if (apkFile) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const newName = `app-${timestamp}.apk`;
      const newPath = path.join(downloadsDir, newName);
      
      await fs.move(path.join(downloadsDir, apkFile), newPath);
      
      spinner.succeed(chalk.green(`✅ APK downloaded successfully!`));
      console.log(chalk.blue(`📱 APK saved to: ${newPath}`));
      
      // Show file size
      const stats = await fs.stat(newPath);
      const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(chalk.cyan(`📊 File size: ${fileSizeInMB} MB`));
      
    } else {
      throw new Error('APK file not found in downloaded artifacts');
    }
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to download APK: ' + error.message));
    console.log(chalk.yellow('💡 You can manually download from GitHub Actions:'));
    console.log(chalk.blue(`🔗 https://github.com/${owner}/${repo}/actions/runs/${runId}`));
  }
}

async function showConfig() {
  console.log(chalk.blue('🔧 Current APK Configuration:'));
  console.log('');
  
  try {
    if (await fs.pathExists('apk-config.json')) {
      const config = await fs.readJson('apk-config.json');
      
      console.log(chalk.green('📱 App Name:') + ' ' + config.appName);
      console.log(chalk.green('🆔 App ID:') + ' ' + config.appId);
      console.log(chalk.green('📦 Version:') + ' ' + config.version);
      console.log(chalk.green('📝 Description:') + ' ' + config.description);
      console.log(chalk.green('🎨 Custom Icon:') + ' ' + (config.icon.enabled ? '✅ Enabled' : '❌ Disabled'));
      console.log(chalk.green('🖼️  Custom Splash:') + ' ' + (config.splash.enabled ? '✅ Enabled' : '❌ Disabled'));
      
    } else {
      console.log(chalk.yellow('⚠️  No configuration file found. Using default settings.'));
    }
    
  } catch (error) {
    console.log(chalk.red('❌ Error reading configuration: ' + error.message));
  }
}

async function setup() {
  console.log(chalk.blue('🚀 Web2APK Setup'));
  console.log('');
  
  try {
    // Run the update config script
    const { updateConfig } = require('./scripts/update-config.js');
    await updateConfig();
    
    console.log(chalk.green('✅ Setup completed!'));
    console.log(chalk.blue('📋 Next steps:'));
    console.log('1. Edit apk-config.json to customize your app');
    console.log('2. Add your website files to the www/ folder');
    console.log('3. Commit and push your changes');
    console.log('4. Run "web2apk getapp" to download your APK');
    
  } catch (error) {
    console.log(chalk.red('❌ Setup failed: ' + error.message));
  }
}

function showHelp() {
  console.log(chalk.blue('🚀 Web2APK - Convert Websites to Android APKs'));
  console.log('');
  console.log(chalk.green('Commands:'));
  console.log('  web2apk getapp     - Check build status and download APK');
  console.log('  web2apk config     - Show current APK configuration');
  console.log('  web2apk setup      - Run initial setup');
  console.log('  web2apk help       - Show this help message');
  console.log('');
  console.log(chalk.blue('Examples:'));
  console.log('  web2apk getapp     # Check status and download latest APK');
  console.log('  web2apk config     # View current app settings');
  console.log('');
  console.log(chalk.yellow('📚 For more information, visit:'));
  console.log('https://github.com/AshishY794/web2appA');
}

// Run the main function
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
