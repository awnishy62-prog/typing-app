# 🚀 Getting Started with Web2App Converter

Welcome to Web2App Converter! This guide will help you convert your HTML/CSS/JavaScript website into an Android APK in just a few simple steps.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Android Studio** (for local APK building) - [Download here](https://developer.android.com/studio)
- **Java JDK** (11 or higher) - Usually comes with Android Studio

> **Note**: If you only want to use GitHub Actions for building, you don't need Android Studio or Java installed locally!

## 🎯 Quick Start (3 Steps)

### Step 1: Clone and Setup
```bash
# Clone this repository
git clone <your-repo-url>
cd web2app-converter

# Install dependencies and setup
npm install
npm run setup
```

### Step 2: Add Your Website
Replace the example files with your own:
- `index.html` - Your main HTML file
- `style.css` - Your CSS styles
- `script.js` - Your JavaScript code
- Any other assets (images, fonts, etc.)

### Step 3: Build APK
```bash
npm run buildapk
```

That's it! Your APK will be generated as `app-debug.apk` in your project folder.

## 🛠️ Alternative Setup Methods

### Method 1: Using Installation Scripts

**For Windows:**
```bash
# Double-click install.bat or run:
install.bat
```

**For Mac/Linux:**
```bash
# Make executable and run:
chmod +x install.sh
./install.sh
```

### Method 2: Manual Setup
```bash
# Install dependencies
npm install

# Initialize Capacitor
npx cap init

# Add Android platform
npx cap add android

# Sync files
npx cap sync
```

## 📱 Building Your APK

### Local Building
```bash
# Build APK locally (requires Android Studio)
npm run buildapk
```

### GitHub Actions (Recommended)
1. Push your code to GitHub
2. Go to the "Actions" tab in your repository
3. Download the APK from the workflow artifacts or releases

## 🎨 Customizing Your App

### App Information
Edit `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.yourapp',  // Your app ID
  appName: 'Your App Name',          // Your app name
  webDir: 'dist',
  // ... other settings
};
```

### App Icon
Replace the icon files in `android/app/src/main/res/` with your own:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### Splash Screen
Edit `android/app/src/main/res/values/styles.xml` to customize the splash screen.

## 🔧 Available Commands

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
├── 📁 android/            # Android project files
├── 📁 .github/            # GitHub Actions workflows
└── 📄 README.md           # Documentation
```

## 🚨 Troubleshooting

### Common Issues

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

### Getting Help

1. Check the [Issues](https://github.com/yourusername/web2app-converter/issues) page
2. Create a new issue with your error details
3. Include your `package.json` and error logs

## 🎯 Next Steps

After successfully building your APK:

1. **Test on Device**: Install the APK on an Android device
2. **Customize**: Modify app settings, icons, and branding
3. **Optimize**: Add PWA features, improve performance
4. **Deploy**: Share your APK or publish to app stores

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Development Guide](https://developer.android.com/guide)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PWA Features](https://web.dev/progressive-web-apps/)

## 🎉 Success!

You've successfully converted your website to an Android APK! 

**What you've accomplished:**
- ✅ Set up a complete Web2App converter
- ✅ Built your first APK
- ✅ Learned the basics of Capacitor
- ✅ Set up automated building with GitHub Actions

**Ready for more?**
- Try building for iOS (requires macOS)
- Add native plugins and features
- Optimize for app store distribution
- Create multiple app variants

Happy building! 🚀

