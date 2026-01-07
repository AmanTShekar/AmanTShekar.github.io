const fs = require('fs');

try {
    const styleContent = fs.readFileSync('style.css', 'utf8');
    const cleanEndContent = fs.readFileSync('clean_end.css', 'utf8');

    // Ensure we don't double append if checking might be complex, 
    // but since we just truncated, a simple concatenation is what we want.
    // Adding a newline just in case.
    const combined = styleContent + '\n' + cleanEndContent;

    fs.writeFileSync('style.css', combined);
    console.log('Successfully appended styles.');
} catch (err) {
    console.error('Error appending files:', err);
    process.exit(1);
}
