const db = require('better-sqlite3')('./data/archmedics_hms.db');

try {
    const tableInfo = db.pragma('table_info(transactions)');
    console.log('Transactions Table Schema:');
    console.table(tableInfo);
} catch (error) {
    console.error('Error verifying schema:', error);
}
