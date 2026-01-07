const fs = require('fs');

const cssContent = fs.readFileSync('style.css', 'utf8');
const lines = cssContent.split(/\r?\n/);

// We need to keep lines 0 to 1052 (inclusive) if possible.
// Careful with 0-based index. 
// If we want 1053 lines total (0-1052), we slice(0, 1053).

// Let's check line 1052 safely
if (lines.length > 1052) {
    console.log('Truncating from line 1053 onwards...');
    const keptLines = lines.slice(0, 1053);
    fs.writeFileSync('style.css', keptLines.join('\n'));
    console.log('Truncated successfully.');
} else {
    console.log('File is already shorter than 1053 lines.');
}
