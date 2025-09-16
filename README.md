# 🚀 Web2App Converter

[![Build APK](https://github.com/yourusername/web2app-converter/actions/workflows/build-apk.yml/badge.svg)](https://github.com/yourusername/web2app-converter/actions/workflows/build-apk.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Convert your HTML/CSS/JavaScript website into an Android APK with just one command! This repository makes it incredibly easy to transform any web project into a native Android application using Capacitor.

## ✨ Features

- 🎯 **One-Command Build**: Just run `npm run buildapk` and get your APK!
- 🔄 **Automatic Setup**: Automatically downloads dependencies and configures everything
- 📱 **Native Performance**: Uses Capacitor for optimal mobile performance
- 🤖 **GitHub Actions**: Automated APK building with GitHub workflows
- 📦 **Zero Configuration**: Works out of the box with any HTML/CSS/JS project
- 🎨 **Beautiful Example**: Includes a stunning example website to get you started

## 🚀 Quick Start

### Option 1: GitHub Actions (Recommended - No Local Setup!)

1. **Fork this repository** or create a new one from this template
2. **Add your website files** to the root directory:
   - `index.html` (required)
   - `style.css` (optional)
   - `script.js` (optional)
   - Any other assets (images, fonts, etc.)
3. **Push to GitHub** - APK will be built automatically!
4. **Download your APK** from the Actions tab or Releases page

### Option 2: Local Building

1. **Clone This Repository**
```bash
git clone <your-repo-url>
cd web2app-converter
```

2. **Add Your Website Files**
Simply place your website files in the root directory:
- `index.html` (required)
- `style.css` (optional)
- `script.js` (optional)
- Any other assets (images, fonts, etc.)

3. **Build Your APK**
```bash
npm run buildapk
```

That's it! Your APK will be generated and saved as `app-debug.apk` in your project folder.

## 📋 Prerequisites

### For Local Building:
- **Node.js** (v16 or higher)
- **Android Studio** (for Android SDK)
- **Java** (JDK 11 or higher)

### For GitHub Actions (No Local Setup Required):
- Just push your code to GitHub and the workflow will build the APK automatically!

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run buildapk` | Build APK from your website |
| `npm run setup` | Initial setup and configuration |
| `npm run build` | Setup + Build APK in one command |
| `npm run dev` | Run app in development mode |
| `npm run sync` | Sync files with Capacitor |

## 📁 Project Structure

```
web2app-converter/
├── 📄 index.html          # Your website's main file
├── 🎨 style.css           # Your website's styles
├── ⚡ script.js           # Your website's JavaScript
├── 📦 package.json        # Dependencies and scripts
├── ⚙️ capacitor.config.ts # Capacitor configuration
├── 📁 scripts/            # Build automation scripts
│   ├── setup.js          # Initial setup script
│   └── build-apk.js      # APK building script
├── 📁 .github/            # GitHub Actions workflows
│   └── workflows/
│       └── build-apk.yml  # Automated APK building
└── 📄 README.md           # This file
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

1. Replace `android/app/src/main/res/` icon files with your own
2. Update splash screen in `android/app/src/main/res/values/styles.xml`

## 🤖 GitHub Actions (No Android Studio Required!)

This repository includes automated APK building with GitHub Actions - **no local Android Studio setup needed!**

### 🚀 Automatic Builds
- **On Push**: Every push to main/master branch builds an APK
- **On PR**: Pull requests also trigger APK builds for testing
- **Manual**: Use "Actions" tab to manually trigger builds
- **On Tags**: Release builds are created when you push version tags

### 📱 APK Downloads
- **Artifacts**: Download APK from the "Actions" tab (30-day retention)
- **Releases**: Automatic releases are created on main branch pushes
- **Release APKs**: Signed APKs are created for version tags
- **Direct Download**: APK files are attached to releases

### 🛠️ How It Works
1. **Push your code** to GitHub
2. **GitHub Actions** automatically:
   - Sets up Android SDK
   - Installs dependencies
   - Builds your APK
   - Creates a release with download link
3. **Download your APK** from the Actions tab or Releases page

### 📋 Workflow Files
- `.github/workflows/build-apk.yml` - Debug APK builds
- `.github/workflows/build-release.yml` - Signed release APK builds

## 📱 Installation

### Installing the APK on Android:

1. **Enable Unknown Sources**:
   - Go to Settings > Security > Unknown Sources
   - Enable "Install from unknown sources"

2. **Install the APK**:
   - Download the APK file
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

### Common Issues:

**"Capacitor not initialized"**
```bash
npm run setup
```

**"Android platform not found"**
```bash
npm run setup
```

**"Build failed"**
- Ensure Android Studio is installed
- Check that JAVA_HOME is set correctly
- Verify your website files are in the root directory

**"APK not found"**
- Check the `android/app/build/outputs/apk/debug/` directory
- Ensure the build completed successfully

### Getting Help:

1. Check the [Issues](https://github.com/yourusername/web2app-converter/issues) page
2. Create a new issue with your error details
3. Include your `package.json` and error logs

## 🚀 Advanced Usage

### Custom Build Scripts

You can customize the build process by modifying:
- `scripts/build-apk.js` - Main build logic
- `scripts/setup.js` - Setup and configuration
- `.github/workflows/build-apk.yml` - GitHub Actions workflow

### Multiple Environments

Create different configurations for development and production:

```bash
# Development build
npm run buildapk

# Production build (modify scripts for release builds)
npm run buildapk -- --release
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Support

If this project helped you, please give it a star! ⭐

## 📞 Contact

- **GitHub**: [Your GitHub Profile](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Website**: [Your Website](https://yourwebsite.com)

---

**Made with ❤️ for the web development community**

*Convert your websites to apps in minutes, not hours!*

