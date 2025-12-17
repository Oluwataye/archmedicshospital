
const db = require('better-sqlite3')('data/archmedics_hms.db');

const user = db.prepare("SELECT * FROM users WHERE email = ?").get('admin@archmedics.com');
console.log('Admin User:', user || 'NOT FOUND');
