const fs = require('fs');
const path = require('path');

const migrationsDir = './migrations';
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.ts'));

// Patterns to fix: integer foreign keys that reference users or patients (which have uuid ids)
const fixes = [
    // Pattern: table.integer('COLUMN_NAME').references('id').inTable('users')
    // Replace with: table.uuid('COLUMN_NAME').references('id').inTable('users')
    {
        pattern: /table\.integer\('([^']+)'\)\.references\('id'\)\.inTable\('users'\)/g,
        replacement: "table.uuid('$1').references('id').inTable('users')"
    },
    {
        pattern: /table\.integer\('([^']+)'\)\.references\('id'\)\.inTable\('patients'\)/g,
        replacement: "table.uuid('$1').references('id').inTable('patients')"
    },
    // Also handle cases with .nullable() or .notNullable()
    {
        pattern: /table\.integer\('([^']+)'\)(\.nullable\(\)|\.notNullable\(\))\.references\('id'\)\.inTable\('users'\)/g,
        replacement: "table.uuid('$1')$2.references('id').inTable('users')"
    },
    {
        pattern: /table\.integer\('([^']+)'\)(\.nullable\(\)|\.notNullable\(\))\.references\('id'\)\.inTable\('patients'\)/g,
        replacement: "table.uuid('$1')$2.references('id').inTable('patients')"
    }
];

let totalFiles = 0;
let totalReplacements = 0;

files.forEach(file => {
    const filePath = path.join(migrationsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let fileChanged = false;
    let fileReplacements = 0;

    fixes.forEach(fix => {
        const before = content;
        content = content.replace(fix.pattern, fix.replacement);
        if (content !== before) {
            const matches = before.match(fix.pattern);
            if (matches) {
                fileReplacements += matches.length;
                fileChanged = true;
            }
        }
    });

    if (fileChanged) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Fixed: ${file} (${fileReplacements} replacements)`);
        totalFiles++;
        totalReplacements += fileReplacements;
    }
});

console.log(`\n✓ Updated ${totalFiles} migration files with ${totalReplacements} total replacements`);
