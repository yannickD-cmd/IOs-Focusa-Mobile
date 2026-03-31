/**
 * EAS build post-install script.
 * Ensures .expo/web is writable before expo prebuild runs.
 * Falls back to patching @expo/image-utils to use /tmp if .expo is root-owned.
 */
const fs = require('fs');
const path = require('path');

// Step 1: try to remove and recreate .expo/web
try {
  fs.rmSync('.expo', { recursive: true, force: true });
} catch (e) {
  console.log('[eas-fix] Could not remove .expo:', e.message);
}

try {
  fs.mkdirSync(path.join('.expo', 'web'), { recursive: true });
  console.log('[eas-fix] Created .expo/web successfully');
  process.exit(0);
} catch (e) {
  console.log('[eas-fix] Could not create .expo/web (likely root-owned), patching Cache.js fallback:', e.message);
}

// Step 2: fallback — patch @expo/image-utils to use /tmp
const cacheFile = path.join('node_modules', '@expo', 'image-utils', 'build', 'Cache.js');
try {
  let content = fs.readFileSync(cacheFile, 'utf8');
  const patched = content.replace(
    "const CACHE_LOCATION = '.expo/web/cache/production/images';",
    "const CACHE_LOCATION = '/tmp/expo-image-cache';"
  );
  if (patched !== content) {
    fs.writeFileSync(cacheFile, patched);
    console.log('[eas-fix] Patched @expo/image-utils Cache.js to use /tmp/expo-image-cache');
  } else {
    console.log('[eas-fix] Cache.js already patched or pattern not found — skipping');
  }
} catch (patchErr) {
  console.error('[eas-fix] Failed to patch Cache.js:', patchErr.message);
  process.exit(1);
}
