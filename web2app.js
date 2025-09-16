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
      
      // Clear www directory first
      await fs.emptyDir('www');
      
      // Copy found files
      for (const file of foundFiles) {
        const sourcePath = path.join(parentDir, file);
        const destPath = path.join('www', file);
        await fs.copy(sourcePath, destPath);
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
          }
        }
      }
      
      console.log(chalk.green('✅ Website files copied successfully!'));
    } else {
      // Ask for manual path if no files found
      const websitePath = await askQuestion('No website files found in parent directory. Enter the path to your website folder: ');
      
      if (await fs.pathExists(websitePath)) {
        // Clear www directory first
        await fs.emptyDir('www');
        
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

async function pushToGitHub(ghCommand = 'gh') {
  console.log(chalk.blue('\n🚀 Pushing to GitHub...'));
  
  const spinner = ora('Adding files to Git...').start();
  
  try {
    // Add all files
    execSync('git add .', { stdio: 'pipe' });
    spinner.text = 'Committing changes...';
    
    // Commit
    execSync('git commit -m "Initial commit: Convert website to Android app"', { stdio: 'pipe' });
    spinner.text = 'Pushing to GitHub...';
    
    // Try to push
    try {
      execSync('git push origin main', { stdio: 'pipe' });
      spinner.succeed(chalk.green('✅ Successfully pushed to GitHub!'));
      console.log(chalk.blue('🔄 GitHub Actions is now building your APK...'));
    } catch (pushError) {
      // If push fails, try to create the repository
      if (pushError.message.includes('Repository not found') || pushError.message.includes('remote: Repository not found')) {
        spinner.text = 'Creating GitHub repository...';
        
        // Get repository info from git remote
        const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
        const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/);
        
        if (repoMatch) {
          const [, username, repoName] = repoMatch;
          const cleanRepoName = repoName.replace('.git', '');
          
          try {
            // Create repository using GitHub CLI
            execSync(`gh repo create ${cleanRepoName} --public --source=. --remote=origin --push`, { stdio: 'pipe' });
            spinner.succeed(chalk.green('✅ Created GitHub repository and pushed successfully!'));
            console.log(chalk.blue('🔄 GitHub Actions is now building your APK...'));
          } catch (createError) {
            spinner.fail(chalk.red('❌ Failed to create repository: ' + createError.message));
            console.log(chalk.yellow('💡 Please create the repository manually on GitHub and try again.'));
            console.log(chalk.blue(`🔗 Go to: https://github.com/new`));
            console.log(chalk.blue(`📝 Repository name: ${cleanRepoName}`));
            throw createError;
          }
        } else {
          throw pushError;
        }
      } else {
        throw pushError;
      }
    }
    
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
    // Use the existing web2apk getapp functionality
    const { getApp } = require('./web2apk.js');
    await getApp();
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not automatically download APK.'));
    console.log(chalk.blue('💡 You can manually download it from GitHub Actions when ready.'));
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
