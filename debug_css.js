const fs = require('fs');

const content = fs.readFileSync('style.css');
console.log('File size:', content.length);
console.log('First 50 bytes:', content.slice(0, 50));
console.log('First 50 chars as string:', content.slice(0, 50).toString());

// Check for null bytes
let nullCount = 0;
for (let i = 0; i < content.length; i++) {
    if (content[i] === 0) nullCount++;
}
console.log('Null bytes count:', nullCount);

// Check for spaces-every-other-char pattern
let spaceCount = 0;
// Sample a chunk from the middle/end
const start = content.length - 1000;
for (let i = start; i < content.length; i++) {
    if (content[i] === 32) spaceCount++;
}
console.log('Space count in last 1000 bytes:', spaceCount);
