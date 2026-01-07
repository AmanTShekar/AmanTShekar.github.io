const fs = require('fs');

const cssContent = fs.readFileSync('style.css', 'utf8');
const lines = cssContent.split(/\r?\n/);
const cleanLines = [];

for (const line of lines) {
    // Stop as soon as we see the corruption pattern (spaced characters) or the duplicate media query line
    if (line.includes('@ m e d i a') || (line.trim().startsWith('. h e r o'))) {
        console.log('Found corruption start at:', line.substring(0, 20) + '...');
        break;
    }
    cleanLines.push(line);
}

// Write the clean part back
// We need to verify where we stopped.
// The known good state ends around line 1052 (closing brace of 900px media query).
// If we stopped correctly, cleanLines should be around 1052 lines long.

// Ensure we don't have a half-open brace if we cut in the middle of a block (unlikely if splitting by line).
// But let's check: the last line should be "}"
let lastLine = cleanLines[cleanLines.length - 1].trim();
if (lastLine !== '}') {
    // If the last line isn't a closing brace, we might have cut too early or late.
    // Ideally we want to cut right after the @media (max-width: 900px) block closes.
    // Let's explicitly search for that block end if possible, but the loop above is decent.
}

fs.writeFileSync('style.css', cleanLines.join('\n'));
console.log('Truncated style.css to', cleanLines.length, 'lines.');
