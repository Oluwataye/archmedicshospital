
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs/error.log');

try {
    const data = fs.readFileSync(logPath, 'utf8');
    const lines = data.trim().split('\n');
    const lastLine = lines[lines.length - 1];

    // The log format is "TIMESTAMP LEVEL: MESSAGE". 
    // Message might be JSON.
    const firstBrace = lastLine.indexOf('{');
    if (firstBrace !== -1) {
        const jsonPart = lastLine.substring(firstBrace);
        const obj = JSON.parse(jsonPart);
        console.log('Error Message:', obj.message);
    } else {
        console.log('Last Line:', lastLine);
    }
} catch (e) {
    console.error(e);
}
