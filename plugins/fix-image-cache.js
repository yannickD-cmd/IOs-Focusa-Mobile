/**
 * Expo config plugin: patches @expo/image-utils Cache.js at runtime
 * to use /tmp for icon caching instead of .expo/web/ which has
 * EACCES permission issues on EAS build servers.
 *
 * This runs inside the expo prebuild process — it cannot be bypassed
 * by EAS cache restoration or build orchestration.
 *
 * withIosIcons.js lazy-loads @expo/image-utils, so patching the file
 * here (before any mod executes) guarantees the patched version is used.
 */
const fs = require('fs');
const path = require('path');

module.exports = function fixImageCache(config) {
  let cacheFile;
  try {
    cacheFile = require.resolve('@expo/image-utils/build/Cache');
  } catch {
    // Fallback to relative path
    cacheFile = path.join(
      process.cwd(),
      'node_modules',
      '@expo',
      'image-utils',
      'build',
      'Cache.js'
    );
  }

  console.log('[fix-image-cache] Patching:', cacheFile);

  try {
    const content = fs.readFileSync(cacheFile, 'utf8');
    const target = "const CACHE_LOCATION = '.expo/web/cache/production/images';";

    if (content.includes(target)) {
      const patched = content.replace(
        target,
        "const CACHE_LOCATION = '/tmp/expo-image-cache';"
      );
      fs.writeFileSync(cacheFile, patched);

      // Clear from Node's require cache so the patched version loads
      const resolved = require.resolve(cacheFile);
      delete require.cache[resolved];

      console.log('[fix-image-cache] SUCCESS — cache redirected to /tmp/expo-image-cache');
    } else if (content.includes('/tmp/expo-image-cache')) {
      console.log('[fix-image-cache] Already patched');
    } else {
      // Pattern didn't match — dump for debugging
      console.log('[fix-image-cache] WARNING: pattern not found in Cache.js');
      console.log('[fix-image-cache] File contents (first 400 chars):');
      console.log(content.substring(0, 400));
    }
  } catch (err) {
    console.error('[fix-image-cache] ERROR:', err.message);
  }

  return config;
};
