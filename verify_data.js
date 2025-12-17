const db = require('better-sqlite3')('./data/archmedics_hms.db');

try {
    const transactions = db.prepare('SELECT * FROM transactions ORDER BY id DESC LIMIT 5').all();
    console.log('Recent Transactions:');
    console.table(transactions);
} catch (error) {
    console.error('Error verifying data:', error);
}
