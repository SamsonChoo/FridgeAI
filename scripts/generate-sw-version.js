const fs = require('fs');
const path = require('path');

const version = Date.now(); // Use current timestamp as version
const versionFilePath = path.join(__dirname, '../public/sw-version.json');

fs.writeFileSync(versionFilePath, JSON.stringify({ version }));

console.log(`Generated service worker version file: ${versionFilePath}`); 