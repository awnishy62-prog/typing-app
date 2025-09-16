#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Helper function to get the correct GitHub CLI command
function getGitHubCLICommand() {
  try {
    execSync('gh --version', { stdio: 'pipe' });
    return 'gh';
  } catch (ghError) {
    // Check common installation paths
    const possiblePaths = [
      'C:\\Program Files\\GitHub CLI\\gh.exe',
      'C:\\Program Files (x86)\\GitHub CLI\\gh.exe',
      'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Programs\\GitHub CLI\\gh.exe',
      '/usr/local/bin/gh',
      '/usr/bin/gh'
    ];
    
    for (const path of possiblePaths) {
      try {
        execSync(`"${path}" --version`, { stdio: 'pipe' });
        return `"${path}"`;
      } catch (e) {
        // Continue checking other paths
      }
    }
    
    return 'gh'; // Fallback
  }
}

// Main command handler
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'help':
      showHelp();
      break;
    case 'enter':
    case undefined:
    default:
      // If no command or 'enter' command, run the fully automated setup
      await fullyAutomatedSetup();
      break;
  }
}

async function fullyAutomatedSetup() {
  console.log(chalk.blue('🚀 Welcome to Web2App - Fully Automated Setup!'));
  console.log(chalk.yellow('🎯 This will guide you through everything step by step!'));
  console.log('');

  try {
    // Step 1: Check if we're in the right directory
    await checkProjectStructure();

    // Step 2: Check GitHub CLI
    const ghCommand = await checkAndSetupGitHubCLI();

    // Step 3: Get user's website files
    await getWebsiteFiles();

    // Step 4: Setup Git repository
    await setupGitRepository();

    // Step 5: Customize app settings
    await customizeAppSettings();

    // Step 6: Push to GitHub
    await pushToGitHub(ghCommand);

    // Step 7: Wait for build and download APK
    await waitForBuildAndDownload();

    // Success!
    console.log(chalk.green('\n🎉🎉🎉 SUCCESS! 🎉🎉🎉'));
    console.log(chalk.blue('Your website has been converted to an Android app!'));
    console.log(chalk.cyan('📱 Check the downloads/ folder for your APK file!'));
    console.log(chalk.yellow('📲 You can now install it on any Android device!'));

  } catch (error) {
    console.log(chalk.red('\n❌ Setup failed: ' + error.message));
    console.log(chalk.yellow('💡 Don\'t worry! You can try again or ask for help.'));
  } finally {
    rl.close();
  }
}

async function checkProjectStructure() {
  const spinner = ora('Checking project structure...').start();
  
  try {
    // Check if we're in the right directory
    if (!await fs.pathExists('package.json')) {
      throw new Error('Please run this command from the web2appA directory');
    }

    // Check if www directory exists
    if (!await fs.pathExists('www')) {
      await fs.ensureDir('www');
    }

    spinner.succeed(chalk.green('✅ Project structure is ready!'));
  } catch (error) {
    spinner.fail(chalk.red('❌ ' + error.message));
    throw error;
  }
}

async function checkAndSetupGitHubCLI() {
  const spinner = ora('Checking GitHub CLI...').start();
  
  try {
    // Check if GitHub CLI is installed
    let ghCommand = 'gh';
    let ghFound = false;
    
    try {
      execSync('gh --version', { stdio: 'pipe' });
      ghFound = true;
    } catch (ghError) {
      // Check common installation paths
      const possiblePaths = [
        'C:\\Program Files\\GitHub CLI\\gh.exe',
        'C:\\Program Files (x86)\\GitHub CLI\\gh.exe',
        'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Programs\\GitHub CLI\\gh.exe',
        '/usr/local/bin/gh',
        '/usr/bin/gh'
      ];
      
      for (const path of possiblePaths) {
        try {
          execSync(`"${path}" --version`, { stdio: 'pipe' });
          ghCommand = `"${path}"`;
          ghFound = true;
          break;
        } catch (e) {
          // Continue checking other paths
        }
      }
    }
    
    if (!ghFound) {
      spinner.fail(chalk.red('❌ GitHub CLI not found'));
      console.log(chalk.yellow('🔧 Let\'s install GitHub CLI first!'));
      
      const installChoice = await askQuestion('Do you want to install GitHub CLI now? (y/n): ');
      if (installChoice.toLowerCase() === 'y' || installChoice.toLowerCase() === 'yes') {
        await installGitHubCLI();
        // After installation, try to find gh command again
        try {
          execSync('gh --version', { stdio: 'pipe' });
          ghCommand = 'gh';
          ghFound = true;
        } catch (e) {
          // Check paths again after installation
          const possiblePaths = [
            'C:\\Program Files\\GitHub CLI\\gh.exe',
            'C:\\Program Files (x86)\\GitHub CLI\\gh.exe',
            'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Programs\\GitHub CLI\\gh.exe'
          ];
          
          for (const path of possiblePaths) {
            try {
              execSync(`"${path}" --version`, { stdio: 'pipe' });
              ghCommand = `"${path}"`;
              ghFound = true;
              break;
            } catch (e2) {
              // Continue checking other paths
            }
          }
        }
      } else {
        throw new Error('GitHub CLI is required. Please install it manually and try again.');
      }
    }

    // Check if authenticated
    try {
      execSync(`${ghCommand} auth status`, { stdio: 'pipe' });
      spinner.succeed(chalk.green('✅ GitHub CLI is ready!'));
    } catch (authError) {
      spinner.fail(chalk.red('❌ GitHub CLI not authenticated'));
      console.log(chalk.yellow('🔐 Let\'s log in to GitHub!'));
      
      const loginChoice = await askQuestion('Do you want to log in to GitHub now? (y/n): ');
      if (loginChoice.toLowerCase() === 'y' || loginChoice.toLowerCase() === 'yes') {
        await authenticateGitHub(ghCommand);
      } else {
        throw new Error('GitHub authentication is required. Please run "gh auth login" and try again.');
      }
    }

    return ghCommand; // Return the ghCommand for use in other functions

  } catch (error) {
    spinner.fail(chalk.red('❌ ' + error.message));
    throw error;
  }
}

async function installGitHubCLI() {
  console.log(chalk.blue('📦 Installing GitHub CLI...'));
  
  const os = process.platform;
  if (os === 'win32') {
    console.log(chalk.yellow('🪟 Windows detected. Installing via winget...'));
    try {
      execSync('winget install GitHub.cli', { stdio: 'inherit' });
      console.log(chalk.green('✅ GitHub CLI installed! Please restart your terminal and run this command again.'));
      process.exit(0);
    } catch (error) {
      console.log(chalk.red('❌ Failed to install via winget. Please install manually from: https://cli.github.com/'));
      throw error;
    }
  } else if (os === 'darwin') {
    console.log(chalk.yellow('🍎 macOS detected. Installing via Homebrew...'));
    try {
      execSync('brew install gh', { stdio: 'inherit' });
      console.log(chalk.green('✅ GitHub CLI installed!'));
    } catch (error) {
      console.log(chalk.red('❌ Failed to install via Homebrew. Please install manually from: https://cli.github.com/'));
      throw error;
    }
  } else {
    console.log(chalk.yellow('🐧 Linux detected. Installing via apt...'));
    try {
      execSync('sudo apt update && sudo apt install gh', { stdio: 'inherit' });
      console.log(chalk.green('✅ GitHub CLI installed!'));
    } catch (error) {
      console.log(chalk.red('❌ Failed to install via apt. Please install manually from: https://cli.github.com/'));
      throw error;
    }
  }
}

async function authenticateGitHub(ghCommand) {
  console.log(chalk.blue('🔐 Starting GitHub authentication...'));
  console.log(chalk.yellow('This will open a browser window for you to log in.'));
  
  try {
    execSync(`${ghCommand} auth login`, { stdio: 'inherit' });
    console.log(chalk.green('✅ GitHub authentication successful!'));
  } catch (error) {
    console.log(chalk.red('❌ GitHub authentication failed. Please try again.'));
    throw error;
  }
}

async function getWebsiteFiles() {
  console.log(chalk.blue('\n📁 Let\'s add your website files!'));
  console.log(chalk.yellow('You have a few options:'));
  console.log('1. Use the example website (good for testing)');
  console.log('2. Add your own website files');
  console.log('3. Skip for now (you can add files later)');
  
  const choice = await askQuestion('What would you like to do? (1/2/3): ');
  
  if (choice === '1') {
    console.log(chalk.green('✅ Using example website!'));
    // Example website is already in the repo
  } else if (choice === '2') {
    await addCustomWebsite();
  } else if (choice === '3') {
    console.log(chalk.yellow('⏭️  Skipping website files for now.'));
  } else {
    console.log(chalk.yellow('⏭️  Invalid choice, skipping website files for now.'));
  }
}

async function addCustomWebsite() {
  console.log(chalk.blue('\n📂 Adding your custom website...'));
  console.log(chalk.yellow('💡 We\'ll look for your website files in the parent directory.'));
  console.log(chalk.yellow('   If you have files like index.html, style.css, script.js in the parent folder, we\'ll copy them!'));
  
  try {
    // Check if www directory already has files
    if (await fs.pathExists('www')) {
      const existingFiles = await fs.readdir('www');
      if (existingFiles.length > 0) {
        console.log(chalk.yellow(`⚠️  Found existing files in www/: ${existingFiles.join(', ')}`));
        const replaceChoice = await askQuestion('Do you want to replace existing files? (y/n): ');
        if (replaceChoice.toLowerCase() === 'y' || replaceChoice.toLowerCase() === 'yes') {
          console.log(chalk.blue('🗑️  Clearing existing files...'));
          await fs.emptyDir('www');
        } else {
          console.log(chalk.blue('📁 Keeping existing files, will add new ones...'));
        }
      }
    }
    
    // Check parent directory for common website files
    const parentDir = path.join(process.cwd(), '..');
    const commonFiles = ['index.html', 'style.css', 'script.js', 'app.js', 'main.js', 'styles.css'];
    
    let foundFiles = [];
    for (const file of commonFiles) {
      const filePath = path.join(parentDir, file);
      if (await fs.pathExists(filePath)) {
        foundFiles.push(file);
      }
    }
    
    if (foundFiles.length > 0) {
      console.log(chalk.green(`✅ Found website files: ${foundFiles.join(', ')}`));
      
      // Ensure www directory exists
      await fs.ensureDir('www');
      
      // Copy found files
      for (const file of foundFiles) {
        const sourcePath = path.join(parentDir, file);
        const destPath = path.join('www', file);
        await fs.copy(sourcePath, destPath);
        console.log(chalk.gray(`📄 Copied: ${file}`));
      }
      
      // Also copy any other HTML, CSS, JS files
      const allFiles = await fs.readdir(parentDir);
      for (const file of allFiles) {
        const filePath = path.join(parentDir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isFile() && (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js'))) {
          const destPath = path.join('www', file);
          if (!await fs.pathExists(destPath)) { // Don't overwrite already copied files
            await fs.copy(filePath, destPath);
            console.log(chalk.gray(`📄 Copied: ${file}`));
          }
        }
      }
      
      console.log(chalk.green('✅ Website files copied successfully!'));
    } else {
      // Ask for manual path if no files found
      const websitePath = await askQuestion('No website files found in parent directory. Enter the path to your website folder: ');
      
      if (await fs.pathExists(websitePath)) {
        // Ensure www directory exists
        await fs.ensureDir('www');
        
        // Copy files
        await fs.copy(websitePath, 'www');
        console.log(chalk.green('✅ Website files copied successfully!'));
      } else {
        console.log(chalk.red('❌ Path not found. Please check the path and try again.'));
        throw new Error('Website path not found');
      }
    }
  } catch (error) {
    console.log(chalk.red('❌ Failed to copy website files: ' + error.message));
    throw error;
  }
}

async function setupGitRepository() {
  console.log(chalk.blue('\n🔧 Setting up Git repository...'));
  
  // Check if git is initialized
  if (!await fs.pathExists('.git')) {
    console.log(chalk.yellow('📦 Initializing Git repository...'));
    execSync('git init', { stdio: 'pipe' });
  }

  // Get repository information
  const username = await askQuestion('Enter your GitHub username: ');
  const repoName = await askQuestion('Enter your repository name: ');
  
  // Remove existing remote if any
  try {
    execSync('git remote remove origin', { stdio: 'pipe' });
  } catch (e) {
    // Remote might not exist, that's okay
  }

  // Add new remote
  const remoteUrl = `https://github.com/${username}/${repoName}.git`;
  execSync(`git remote add origin ${remoteUrl}`, { stdio: 'pipe' });
  
  console.log(chalk.green('✅ Git repository configured!'));
  console.log(chalk.blue(`📡 Remote URL: ${remoteUrl}`));
}

async function customizeAppSettings() {
  console.log(chalk.blue('\n🎨 Let\'s customize your app!'));
  
  const appName = await askQuestion('Enter your app name (or press Enter for "My Web App"): ') || 'My Web App';
  const appId = await askQuestion('Enter your app ID (or press Enter for "com.example.myapp"): ') || 'com.example.myapp';
  const version = await askQuestion('Enter version (or press Enter for "1.0.0"): ') || '1.0.0';
  const description = await askQuestion('Enter description (or press Enter for "My converted web app"): ') || 'My converted web app';

  // Create apk-config.json
  const config = {
    appName: appName,
    appId: appId,
    version: version,
    description: description,
    icon: {
      enabled: false,
      path: "www/icon.png"
    },
    splashScreen: {
      backgroundColor: "#ffffff",
      imageUrl: "www/splash.png"
    }
  };

  await fs.writeJson('apk-config.json', config, { spaces: 2 });
  console.log(chalk.green('✅ App configuration saved!'));
}

async function pushToGitHub(ghCommand = null) {
  console.log(chalk.blue('\n🚀 Pushing to GitHub...'));
  
  // Get the correct GitHub CLI command
  const actualGhCommand = ghCommand || getGitHubCLICommand();
  console.log(chalk.gray(`🔧 Using GitHub CLI: ${actualGhCommand}`));
  
  const spinner = ora('Checking repository status...').start();
  
  try {
    // Check if repository exists and has files
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    
    if (repoMatch) {
      const [, username, repoName] = repoMatch;
      const cleanRepoName = repoName.replace('.git', '');
      
      // Check if repository exists
      try {
        execSync(`${actualGhCommand} repo view ${username}/${cleanRepoName}`, { stdio: 'pipe' });
        
        // Repository exists, check if it has files (with timeout)
        spinner.text = 'Checking for existing files in repository...';
        try {
          // Use a timeout for the git ls-remote command
          const filesOutput = execSync(`git ls-remote --heads origin main`, { 
            stdio: 'pipe',
            timeout: 10000 // 10 second timeout
          });
          if (filesOutput.toString().trim()) {
            // Repository has files, we need to force push or handle existing files
            console.log(chalk.yellow('\n⚠️  Repository already has files.'));
            const replaceChoice = await askQuestion('Do you want to replace all existing files? (y/n): ');
            
            if (replaceChoice.toLowerCase() === 'y' || replaceChoice.toLowerCase() === 'yes') {
              console.log(chalk.blue('🗑️  Replacing all existing files...'));
              
              // Force push to replace all files
              spinner.text = 'Force pushing to replace all files...';
              execSync('git add .', { stdio: 'pipe' });
              execSync('git commit -m "Update: Replace all files with new website"', { stdio: 'pipe' });
              execSync('git push origin main --force', { stdio: 'pipe' });
              
              spinner.succeed(chalk.green('✅ Successfully replaced all files in repository!'));
              console.log(chalk.blue('🔄 GitHub Actions is now building your APK...'));
              return;
            } else {
              console.log(chalk.blue('📁 Keeping existing files, adding new ones...'));
            }
          }
        } catch (e) {
          // Repository exists but no main branch yet, or timeout occurred
          console.log(chalk.gray('📝 Repository exists but no main branch found, proceeding with normal push...'));
        }
      } catch (repoError) {
        // Repository doesn't exist, create it
        spinner.text = 'Creating GitHub repository...';
        
        try {
          // First, remove existing remote if it exists
          try {
            execSync('git remote remove origin', { stdio: 'pipe' });
          } catch (e) {
            // Remote doesn't exist, that's fine
          }
          
          // Create repository without --remote=origin to avoid conflicts
          execSync(`${actualGhCommand} repo create ${cleanRepoName} --public --source=. --push`, { stdio: 'pipe' });
          spinner.succeed(chalk.green('✅ Created GitHub repository and pushed successfully!'));
          console.log(chalk.blue('🔄 GitHub Actions is now building your APK...'));
          return;
        } catch (createError) {
          // If the above fails, try a different approach
          try {
            console.log(chalk.yellow('🔄 Trying alternative repository creation method...'));
            
            // Create repository without source
            execSync(`${actualGhCommand} repo create ${cleanRepoName} --public`, { stdio: 'pipe' });
            
            // Add remote manually
            execSync(`git remote add origin https://github.com/${username}/${cleanRepoName}.git`, { stdio: 'pipe' });
            
            // Push manually
            execSync('git add .', { stdio: 'pipe' });
            execSync('git commit -m "Initial commit: Convert website to Android app"', { stdio: 'pipe' });
            execSync('git push origin main', { stdio: 'pipe' });
            
            spinner.succeed(chalk.green('✅ Created GitHub repository and pushed successfully!'));
            console.log(chalk.blue('🔄 GitHub Actions is now building your APK...'));
            return;
          } catch (altError) {
            spinner.fail(chalk.red('❌ Failed to create repository: ' + createError.message));
            console.log(chalk.yellow('💡 Please create the repository manually on GitHub and try again.'));
            console.log(chalk.blue(`🔗 Go to: https://github.com/new`));
            console.log(chalk.blue(`📝 Repository name: ${cleanRepoName}`));
            console.log(chalk.yellow(`🔧 GitHub CLI command used: ${actualGhCommand}`));
            throw createError;
          }
        }
      }
    }
    
    // Normal push process
    spinner.text = 'Adding files to Git...';
    execSync('git add .', { stdio: 'pipe' });
    
    spinner.text = 'Committing changes...';
    execSync('git commit -m "Initial commit: Convert website to Android app"', { stdio: 'pipe' });
    
    spinner.text = 'Pushing to GitHub...';
    execSync('git push origin main', { stdio: 'pipe' });
    
    spinner.succeed(chalk.green('✅ Successfully pushed to GitHub!'));
    console.log(chalk.blue('🔄 GitHub Actions is now building your APK...'));
    
  } catch (error) {
    spinner.fail(chalk.red('❌ Failed to push to GitHub: ' + error.message));
    throw error;
  }
}

async function waitForBuildAndDownload() {
  console.log(chalk.blue('\n⏳ Waiting for your APK to be built...'));
  console.log(chalk.yellow('This usually takes 5-15 minutes. We\'ll check every 30 seconds.'));
  
  // Wait a bit for the workflow to start
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  try {
    // Get repository info
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
    
    if (!repoMatch) {
      throw new Error('Could not determine GitHub repository from git remote.');
    }

    const [, owner, repo] = repoMatch;
    const repoName = repo.replace('.git', '');
    
    // Get GitHub CLI command
    const ghCommand = getGitHubCLICommand();
    
    // Get workflow status
    const workflowStatus = await getWorkflowStatus(owner, repoName, ghCommand);
    
    if (workflowStatus.status === 'completed' && workflowStatus.conclusion === 'success') {
      console.log(chalk.green('✅ Build already completed! Downloading APK...'));
      await downloadAPK(owner, repoName, workflowStatus.runId, ghCommand);
    } else {
      console.log(chalk.blue('🔄 Build in progress, waiting for completion...'));
      await waitForBuildCompletion(owner, repoName, workflowStatus.runId, ghCommand);
    }
    
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not automatically download APK: ' + error.message));
    console.log(chalk.blue('💡 You can manually download it from GitHub Actions when ready.'));
    console.log(chalk.blue('🔗 Go to: https://github.com/' + (repoMatch ? repoMatch[1] + '/' + repoMatch[2].replace('.git', '') : 'your-repo') + '/actions'));
  }
}

async function getWorkflowStatus(owner, repo, ghCommand) {
  try {
    // Get the latest workflow run
    const output = execSync(`${ghCommand} run list --repo ${owner}/${repo} --limit 1 --json databaseId,status,conclusion`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const runs = JSON.parse(output);
    if (runs.length === 0) {
      throw new Error('No workflow runs found. The workflow may not have started yet.');
    }
    
    const latestRun = runs[0];
    return {
      runId: latestRun.databaseId,
      status: latestRun.status,
      conclusion: latestRun.conclusion,
      ghCommand: ghCommand
    };
    
  } catch (error) {
    throw new Error('Failed to get workflow status: ' + error.message);
  }
}

async function waitForBuildCompletion(owner, repo, runId, ghCommand) {
  console.log(chalk.yellow('\n🔄 Waiting for build to complete...'));
  console.log(chalk.blue('⏱️  Checking every 30 seconds for updates...\n'));
  
  let attempts = 0;
  const maxAttempts = 60; // 30 minutes max wait time
  
  while (attempts < maxAttempts) {
    try {
      // Wait 30 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 30000));
      attempts++;
      
      // Get current status
      const output = execSync(`${ghCommand} run view ${runId} --repo ${owner}/${repo} --json status,conclusion`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const runData = JSON.parse(output);
      const status = runData.status;
      const conclusion = runData.conclusion;
      
      // Show progress update
      const progress = Math.min(attempts * 2, 95); // Simulate progress up to 95%
      process.stdout.write(`\r${chalk.blue('📊 Progress:')} ${progress}% ${chalk.gray(`(Check ${attempts}/${maxAttempts})`)}`);
      
      if (status === 'completed') {
        console.log('\n'); // New line after progress
        
        if (conclusion === 'success') {
          console.log(chalk.green('✅ Build completed successfully!'));
          console.log(chalk.blue('📥 Downloading APK...'));
          
          // Download the APK
          await downloadAPK(owner, repo, runId, ghCommand);
          
          console.log(chalk.green('\n🎉 APK ready! Build and download completed successfully!'));
          console.log(chalk.cyan('📱 You can now install the APK on your Android device.'));
          return;
          
        } else if (conclusion === 'failure') {
          console.log(chalk.red('\n❌ Build failed!'));
          console.log(chalk.red(`🔗 View error details: https://github.com/${owner}/${repo}/actions/runs/${runId}`));
          return;
          
        } else {
          console.log(chalk.yellow(`\n⚠️  Build completed with status: ${conclusion}`));
          return;
        }
      }
      
    } catch (error) {
      console.log(chalk.red(`\n❌ Error checking build status: ${error.message}`));
      return;
    }
  }
  
  console.log(chalk.yellow('\n⏰ Build is taking longer than expected. You can check manually:'));
  console.log(chalk.blue(`🔗 https://github.com/${owner}/${repo}/actions/runs/${runId}`));
}

async function downloadAPK(owner, repo, runId, ghCommand) {
  try {
    // Create downloads directory
    await fs.ensureDir('downloads');
    
    // Download artifacts
    const downloadPath = path.join(process.cwd(), 'downloads');
    execSync(`${ghCommand} run download ${runId} --repo ${owner}/${repo} --dir "${downloadPath}"`, { 
      stdio: 'pipe' 
    });
    
    // Find and move APK file
    const files = await fs.readdir(downloadPath);
    let apkFile = null;
    
    // Look for APK files in subdirectories
    for (const file of files) {
      const filePath = path.join(downloadPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory()) {
        const subFiles = await fs.readdir(filePath);
        for (const subFile of subFiles) {
          if (subFile.endsWith('.apk')) {
            apkFile = path.join(filePath, subFile);
            break;
          }
        }
      } else if (file.endsWith('.apk')) {
        apkFile = filePath;
      }
      
      if (apkFile) break;
    }
    
    if (apkFile) {
      const finalApkPath = path.join(downloadPath, 'app-debug.apk');
      await fs.copy(apkFile, finalApkPath);
      console.log(chalk.green(`✅ APK downloaded: ${finalApkPath}`));
    } else {
      console.log(chalk.yellow('⚠️  APK file not found in artifacts'));
    }
    
  } catch (error) {
    throw new Error('Failed to download APK: ' + error.message);
  }
}

function showHelp() {
  console.log(chalk.blue('🚀 Web2App - Fully Automated Website to Android App Converter'));
  console.log('');
  console.log(chalk.green('Commands:'));
  console.log('  web2app           - Start fully automated setup (default)');
  console.log('  web2app help      - Show this help message');
  console.log('');
  console.log(chalk.blue('What web2app does automatically:'));
  console.log('1. ✅ Checks your project structure');
  console.log('2. 🔧 Sets up GitHub CLI (installs if needed)');
  console.log('3. 🔐 Authenticates with GitHub');
  console.log('4. 📁 Helps you add your website files');
  console.log('5. 🏠 Configures your Git repository');
  console.log('6. 🎨 Customizes your app settings');
  console.log('7. 🚀 Pushes everything to GitHub');
  console.log('8. ⏳ Waits for build and downloads your APK');
  console.log('');
  console.log(chalk.yellow('📚 For more information, visit:'));
  console.log('https://github.com/AshishY794/web2appA');
}

// Run the main function
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
