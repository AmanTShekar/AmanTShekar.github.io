const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/target="_blank"/g, 'target="_blank" rel="noopener noreferrer"');
html = html.replace(/href="#"/g, 'href="#" aria-disabled="true"');
fs.writeFileSync('index.html', html);
console.log('Done');
