const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const distSrcDir = path.join(distDir, 'src');

try {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  if (!fs.existsSync(distSrcDir)) {
    fs.mkdirSync(distSrcDir, { recursive: true });
  }

  // Render Web Service Start Command compatibility shim:
  // Render dashboard is configured with `node dist/src/server.js`,
  // whereas TypeScript outDir outputs directly to `dist/server.js`.
  const serverShim = `// Render Start Command Compatibility Shim
// Render dashboard runs: node dist/src/server.js
// Forward execution seamlessly to dist/server.js
module.exports = require('../server.js');
`;

  fs.writeFileSync(path.join(distSrcDir, 'server.js'), serverShim, 'utf8');
  console.log('✅ Generated dist/src/server.js compatibility shim for Render.');
} catch (err) {
  console.error('❌ Failed to create Render compatibility shim:', err);
}
