const fs = require('fs');
const path = require('path');

function removeExtensions(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            removeExtensions(filePath);
        } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Remove .ts extensions from imports
            content = content.replace(/from ['"](.+?)\.ts['"]/g, "from '$1'");
            content = content.replace(/import\(['"](.+?)\.ts['"]\)/g, "import('$1')");

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed: ${filePath}`);
        }
    });
}

const serverDir = path.join(__dirname, '..', 'src', 'server');
const servicesDir = path.join(__dirname, '..', 'src', 'services');

console.log('Fixing server imports...');
removeExtensions(serverDir);

console.log('Fixing drugInteractionService...');
if (fs.existsSync(servicesDir)) {
    const drugServicePath = path.join(servicesDir, 'drugInteractionService.ts');
    if (fs.existsSync(drugServicePath)) {
        let content = fs.readFileSync(drugServicePath, 'utf8');
        content = content.replace(/from ['"](.+?)\.ts['"]/g, "from '$1'");
        fs.writeFileSync(drugServicePath, content, 'utf8');
        console.log(`Fixed: ${drugServicePath}`);
    }
}

console.log('Done!');
