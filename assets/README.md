# Assets Folder

This folder should contain the following images for Expo:

## Required Assets

1. **icon.png** (1024x1024px)
   - App icon for iOS and Android
   - Should be a square PNG image without transparency

2. **splash.png** (1284x2778px recommended)
   - Splash screen shown during app loading
   - Should match the Focusa branding (green #4AB37F)

3. **adaptive-icon.png** (1024x1024px)
   - Android adaptive icon foreground
   - Should have transparent background

4. **favicon.png** (48x48px)
   - Web favicon (if deploying to web)

## Creating Assets

You can create these assets using:
- Figma
- Adobe Illustrator
- Online tools like Canva

### Suggested Design

For Focusa branding:
- Background color: #4AB37F (primary green)
- Icon: White "F" or Focusa cube logo
- Font: Satoshi Bold

### Quick Placeholder

To generate placeholder icons quickly, you can use:
```bash
npx expo-cli prebuild --clean
```

Or create simple colored images and replace later.
