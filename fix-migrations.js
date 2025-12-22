const fs = require('fs');
const path = require('path');

const migrationsDir = './migrations';
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.ts'));

// The exact pattern we need to replace
const oldPattern = 'knex.raw("(lower(hex(randomblob(4))) || \'-\' || lower(hex(randomblob(2))) || \'-4\' || substr(lower(hex(randomblob(2))),2) || \'-\' || substr(\'89ab\',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || \'-\' || lower(hex(randomblob(6))))")';
const newPattern = 'knex.raw("gen_random_uuid()")';

let count = 0;
let totalReplacements = 0;

files.forEach(file => {
    const filePath = path.join(migrationsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('randomblob')) {
        const before = content;
        content = content.split(oldPattern).join(newPattern);

        if (content !== before) {
            const replacements = (before.match(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Fixed: ${file} (${replacements} replacements)`);
            count++;
            totalReplacements += replacements;
        }
    }
});

console.log(`\n✓ Updated ${count} migration files with ${totalReplacements} total replacements`);
