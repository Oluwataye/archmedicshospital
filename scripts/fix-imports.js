import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, '../src/server/routes');

async function fixImports() {
    try {
        const files = fs.readdirSync(routesDir);

        for (const file of files) {
            if (!file.endsWith('.ts')) continue;

            const filePath = path.join(routesDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // Fix db import
            if (content.includes("from '../db'")) {
                content = content.replace("from '../db'", "from '../db.ts'");
                modified = true;
            }
            if (content.includes('from "../db"')) {
                content = content.replace('from "../db"', 'from "../db.ts"');
                modified = true;
            }

            // Fix auth import
            if (content.includes("from '../middleware/auth'")) {
                content = content.replace("from '../middleware/auth'", "from '../middleware/auth.ts'");
                modified = true;
            }
            if (content.includes('from "../middleware/auth"')) {
                content = content.replace('from "../middleware/auth"', 'from "../middleware/auth.ts"');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${file}`);
            }
        }
        console.log('Finished fixing imports.');
    } catch (error) {
        console.error('Error fixing imports:', error);
    }
}

fixImports();
