# 🚀 Web2App Converter

[![Build APK](https://github.com/AshishY794/web2appA/actions/workflows/build-apk.yml/badge.svg)](https://github.com/AshishY794/web2appA/actions/workflows/build-apk.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Convert your HTML/CSS/JavaScript website into an Android APK with just one command! This repository makes it incredibly easy to transform any web project into a native Android application using Capacitor.

## ✨ Features

- 🚀 **Cloud-Based Building**: Build APKs entirely in GitHub Actions - no local setup needed!
- 🤖 **Automatic Workflows**: Every push automatically builds and releases your APK
- 📱 **Native Performance**: Uses Capacitor for optimal mobile performance
- 📦 **Zero Configuration**: Works out of the box with any HTML/CSS/JS project
- 🎨 **Beautiful Example**: Includes a stunning example website to get you started
- 🔄 **Instant Deployment**: Push code, get APK - that's it!

## 🚀 Quick Start (GitHub Actions Only!)

### **Option 1: Automated Setup (Recommended)**

**For Windows:**
```bash
git clone https://github.com/AshishY794/web2appA.git
cd web2appA
complete-setup.bat
```

**For Mac/Linux:**
```bash
git clone https://github.com/AshishY794/web2appA.git
cd web2appA
chmod +x complete-setup.sh
./complete-setup.sh
```

The setup script will:
- ✅ Check VS Code installation
- ✅ Check GitHub CLI authentication
- ✅ Guide you through login if needed
- ✅ Open VS Code for easy editing
- ✅ Show you the complete workflow

### **Option 2: Manual Setup**

### **Step 1: Clone This Repository**
```bash
git clone https://github.com/AshishY794/web2appA.git
cd web2appA
```

### **Step 2: Check GitHub Authentication**
```bash
# Check if you're logged in
gh auth status

# If not logged in, login
gh auth login
```

### **Step 3: Add Your Website Files**
Place your complete website project in the `www` folder:
```bash
# Copy your entire website project to the www folder
cp -r /path/to/your/website/* www/
```

**Required files in `www` folder:**
- `index.html` (required)
- `style.css` (optional)
- `script.js` (optional)
- Any other assets (images, fonts, etc.)

### **Step 4: Remove Current Git and Add Your Remote**
```bash
# Remove current git remote
git remote remove origin

# Add your own repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### **Step 5: Customize Your APK (Optional)**
```bash
# Edit apk-config.json to customize your app
{
  "appName": "My Awesome App",
  "appId": "com.mycompany.myapp",
  "version": "1.0.0",
  "description": "My converted web app",
  "icon": {
    "enabled": true,
    "path": "www/icon.png"
  }
}

# Add your custom icon (192x192 PNG recommended)
# Place icon.png in the www/ folder
```

### **Step 6: Commit and Push**
```bash
git add .
git commit -m "Add my website project"
git push origin main
```

### **Step 7: Download Your APK**
```bash
# Method 1: Using npm script
npm run web2apk getapp

# Method 2: Using batch file (Windows)
web2apk.bat getapp

# Method 3: Using shell script (Mac/Linux)
chmod +x web2apk.sh
./web2apk.sh getapp

# Method 4: Direct node command
node web2apk.js getapp

# Or manually download from GitHub Actions
# Go to Actions tab → Latest workflow → Download APK artifact
```

**That's it! No Android Studio, no local setup needed!** 🎉

## 📋 Prerequisites

### **No Local Setup Required!** 🎉
- Just push your code to GitHub and the workflow will build the APK automatically!
- GitHub Actions handles everything: Node.js, Android SDK, Java, and APK building
- Works on any operating system (Windows, Mac, Linux)

### **For `web2apk getapp` Command (Optional but Recommended):**
- **GitHub CLI** - For automatic APK downloads and status checking

#### **Installing GitHub CLI:**

**Windows:**
```bash
# Method 1: Using winget (recommended)
winget install GitHub.cli

# Method 2: Using our installer
install-gh-cli.bat

# Method 3: Manual download
# Go to: https://cli.github.com/
```

**Mac:**
```bash
# Method 1: Using Homebrew (recommended)
brew install gh

# Method 2: Using our installer
chmod +x install-gh-cli.sh
./install-gh-cli.sh

# Method 3: Manual download
# Go to: https://cli.github.com/
```

**Linux:**
```bash
# Method 1: Using apt (Ubuntu/Debian)
sudo apt update && sudo apt install gh

# Method 2: Using our installer
chmod +x install-gh-cli.sh
./install-gh-cli.sh

# Method 3: Manual download
# Go to: https://cli.github.com/
```

**After Installation:**
```bash
# Authenticate with GitHub
gh auth login

# Test the connection
gh auth status
```

## 🛠️ GitHub Actions Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| **build-apk.yml** | Push to main | Builds debug APK and creates release |
| **build-release.yml** | Version tags | Builds signed release APK |
| **test-setup.yml** | Pull requests | Tests setup without building APK |

**No local commands needed!** Everything runs automatically in GitHub Actions.

## 🚀 Web2APK Command

The `web2apk` command provides easy access to your APK builds:

### **Commands:**
```bash
# Windows
web2apk.bat getapp     # Check build status and download APK
web2apk.bat config     # Show current APK configuration
web2apk.bat setup      # Run initial setup
web2apk.bat help       # Show help message

# Mac/Linux
./web2apk.sh getapp    # Check build status and download APK
./web2apk.sh config    # Show current APK configuration
./web2apk.sh setup     # Run initial setup
./web2apk.sh help      # Show help message

# Or using npm
npm run web2apk getapp # Check build status and download APK
npm run web2apk config # Show current APK configuration
npm run web2apk setup  # Run initial setup
npm run web2apk help   # Show help message
```

### **Examples:**
```bash
# Check if your latest build is ready and download it
npm run web2apk getapp

# View your current app settings
npm run web2apk config

# Run setup (if you haven't already)
npm run web2apk setup
```

### **Features:**
- ✅ **Real-time build status** - See if your APK is ready
- ✅ **Automatic download** - Downloads APK to your project folder
- ✅ **Progress tracking** - Shows build progress in real-time
- ✅ **Error reporting** - Clear error messages if builds fail

## 📁 Project Structure

```
web2appA/
├── 📁 www/                    # Your website files go here
│   ├── 📄 index.html          # Your website's main file
│   ├── 🎨 style.css           # Your website's styles
│   ├── ⚡ script.js           # Your website's JavaScript
│   ├── 📱 manifest.json       # PWA manifest
│   ├── 🔧 sw.js               # Service worker
│   └── 📁 assets/             # Your images, fonts, etc.
├── 📦 package.json            # Dependencies and scripts
├── ⚙️ capacitor.config.ts     # Capacitor configuration
├── 📁 .github/                # GitHub Actions workflows
│   └── workflows/
│       ├── build-apk.yml      # Debug APK building
│       ├── build-release.yml  # Release APK building
│       └── test-setup.yml     # Setup testing
└── 📄 README.md               # This file
```

## 🔧 Configuration

### Customizing Your App

Edit `capacitor.config.ts` to customize your app:

```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.yourapp',  // Change this to your app ID
  appName: 'Your App Name',          // Change this to your app name
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};
```

### App Icon and Splash Screen

**Note**: Since we're using GitHub Actions, you'll need to:
1. Replace icon files in your repository
2. Push changes to trigger automatic rebuild
3. Download the new APK from Actions/Releases

## 🤖 GitHub Actions Workflow

This repository uses **GitHub Actions for automated APK building** - no local setup needed!

### 🚀 How It Works
1. **Push your code** to GitHub
2. **GitHub Actions** automatically:
   - Sets up Android SDK and Java
   - Installs Node.js dependencies
   - Builds your APK using Capacitor
   - Creates a release with download link
3. **Download your APK** from Actions tab or Releases page

### 📱 Build Triggers
- **Push to main**: Builds debug APK + creates release
- **Version tags** (v1.0.0): Builds signed release APK
- **Pull requests**: Tests setup without building APK
- **Manual**: Use "Actions" tab to trigger builds on-demand

### 📥 APK Downloads
- **Actions Tab**: Download APK artifacts (30-day retention)
- **Releases Page**: Automatic releases with APK attachments
- **Direct Links**: APK files attached to every release

## 📱 Installing Your APK

### **Step 1: Download APK**
- Go to your repository's **Actions** tab
- Click on the latest workflow run
- Download the `app-debug-apk` artifact
- Or check the **Releases** page for automatic releases

### **Step 2: Install on Android**
1. **Enable Unknown Sources**:
   - Go to Settings > Security > Unknown Sources
   - Enable "Install from unknown sources"

2. **Install the APK**:
   - Transfer APK to your Android device
   - Tap on it to install
   - Follow the installation prompts

## 🎨 Example Website

This repository includes a beautiful example website that demonstrates:
- Modern CSS with gradients and animations
- Responsive design
- Interactive JavaScript
- Mobile-optimized layout

Replace the example files with your own website to get started!

## 🔍 Troubleshooting

### **GitHub Actions Issues:**

**"Workflow failed"**
- Check the Actions tab for detailed error logs
- Ensure your `index.html` file exists in the root directory
- Verify all required files are committed to Git

**"APK not found in artifacts"**
- Wait for the workflow to complete (usually 5-10 minutes)
- Check the Actions tab for the latest successful run
- Download from the "Artifacts" section

**"Build timeout"**
- GitHub Actions has a 6-hour limit
- Most builds complete in 5-15 minutes
- If it times out, try pushing again

### **Getting Help:**
1. Check the [Issues](https://github.com/AshishY794/web2appA/issues) page
2. Create a new issue with your error details
3. Include the workflow run link and error logs

## 🚀 Advanced Usage

### **Creating Release Versions**

To build signed release APKs:

1. **Create a version tag:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. **GitHub Actions automatically:**
   - Builds a signed release APK
   - Creates a GitHub release
   - Attaches the APK for download

### **Customizing Workflows**

You can modify the GitHub Actions workflows:
- `.github/workflows/build-apk.yml` - Debug APK builds
- `.github/workflows/build-release.yml` - Release APK builds
- `.github/workflows/test-setup.yml` - Setup testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request** - GitHub Actions will test your changes automatically!

## ⭐ Support

If this project helped you, please give it a star! ⭐

## 📞 Contact

- **GitHub**: [AshishY794](https://github.com/AshishY794)
- **Repository**: [web2appA](https://github.com/AshishY794/web2appA)

---

**Made with ❤️ for the web development community**

*Convert your websites to apps in minutes, not hours - all in the cloud!* ☁️

