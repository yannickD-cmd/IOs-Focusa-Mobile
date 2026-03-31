/**
 * EAS build post-install script.
 * Always patches @expo/image-utils to write its icon cache to /tmp
 * instead of .expo/web (which has permission issues on EAS build servers).
 */
const fs = require('fs');
const path = require('path');

const cacheFile = path.join('node_modules', '@expo', 'image-utils', 'build', 'Cache.js');

try {
  let content = fs.readFileSync(cacheFile, 'utf8');

  // Replace the hardcoded .expo/web cache path with /tmp
  const patched = content.replace(
    "const CACHE_LOCATION = '.expo/web/cache/production/images';",
    "const CACHE_LOCATION = '/tmp/expo-image-cache';"
  );

  if (patched !== content) {
    fs.writeFileSync(cacheFile, patched);
    console.log('[eas-fix] Patched Cache.js → /tmp/expo-image-cache');
  } else {
    console.log('[eas-fix] CACHE_LOCATION pattern not found in Cache.js, dumping first 500 chars for debug:');
    console.log(content.substring(0, 500));
  }
} catch (err) {
  console.error('[eas-fix] Failed to patch Cache.js:', err.message);
  process.exit(1);
}
