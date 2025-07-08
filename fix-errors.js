const fs = require('fs');
const path = require('path');

// Function to fix common TypeScript/ESLint errors
function fixCommonErrors(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix unescaped entities
    const unescapedQuotes = /([^\\])"([^"]*)"([^"])/g;
    if (content.match(unescapedQuotes)) {
        content = content.replace(/([^\\])"([^"]*)"([^"])/g, '$1&quot;$2&quot;$3');
        modified = true;
    }
    
    // Fix unescaped apostrophes
    const unescapedApostrophes = /([^\\])'([^']*)'([^'])/g;
    if (content.match(unescapedApostrophes)) {
        content = content.replace(/([^\\])'([^']*)'([^'])/g, '$1&apos;$2&apos;$3');
        modified = true;
    }
    
    // Remove unused index parameters in map functions
    content = content.replace(/\.map\(\(([^,\)]+),\s*index\)\s*=>/g, (match, param) => {
        // Check if index is used in the function
        const functionBody = content.substring(content.indexOf(match));
        const nextClosingBrace = functionBody.indexOf('})');
        const functionContent = functionBody.substring(0, nextClosingBrace);
        
        if (!functionContent.includes('index')) {
            modified = true;
            return `.map((${param}) =>`;
        }
        return match;
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Fixed: ${filePath}`);
    }
}

// Get all TypeScript and JSX files
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!file.startsWith('.') && file !== 'node_modules' && file !== 'build') {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });
    
    return arrayOfFiles;
}

// Run the fix
const allFiles = getAllFiles('./');
allFiles.forEach(fixCommonErrors);
console.log('Finished fixing common errors');
