
const db = require('better-sqlite3')('data/archmedics_hms.db');
const bcrypt = require('bcryptjs'); // Trying bcryptjs first as it's common in these stacks, or bcrypt

const password = 'admin123';
const saltRounds = 10;

try {
    const hash = bcrypt.hashSync(password, saltRounds);
    const result = db.prepare("UPDATE users SET password_hash = ? WHERE role = 'admin'").run(hash);
    console.log('Updated Admin password. Changes:', result.changes);
} catch (e) {
    console.error('Error (trying bcrypt next):', e.message);
    try {
        const bcryptNative = require('bcrypt');
        const hash = bcryptNative.hashSync(password, saltRounds);
        const result = db.prepare("UPDATE users SET password_hash = ? WHERE role = 'admin'").run(hash);
        console.log('Updated Admin password using native bcrypt. Changes:', result.changes);
    } catch (e2) {
        console.error('Failed to hash password:', e2.message);
    }
}
