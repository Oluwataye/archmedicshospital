-- Financial Management Schema
-- This creates the tables needed for financial tracking, transactions, and refunds

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT UNIQUE NOT NULL,
    patient_id INTEGER,
    cashier_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'completed',
    discount_amount REAL DEFAULT 0,
    discount_reason TEXT,
    approved_by INTEGER,
    transaction_date TEXT DEFAULT CURRENT_TIMESTAMP,
    voided INTEGER DEFAULT 0,
    voided_by INTEGER,
    voided_at TEXT,
    void_reason TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (cashier_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (voided_by) REFERENCES users(id)
);

-- Transaction items table (line items)
CREATE TABLE IF NOT EXISTS transaction_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    service_id INTEGER,
    service_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price REAL NOT NULL,
    total_price REAL NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Refunds table
CREATE TABLE IF NOT EXISTS refunds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    reason TEXT NOT NULL,
    requested_by INTEGER NOT NULL,
    requested_at TEXT DEFAULT CURRENT_TIMESTAMP,
    approved_by INTEGER,
    approved_at TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_cashier ON transactions(cashier_id);
CREATE INDEX IF NOT EXISTS idx_transactions_patient ON transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_transactions_invoice ON transactions(invoice_number);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- Seed some sample transaction data for dashboard visualization
INSERT OR IGNORE INTO transactions (invoice_number, patient_id, cashier_id, total_amount, payment_method, transaction_date) VALUES
    ('INV-2023-001', 1, 1, 5000.00, 'Cash', datetime('now', '-1 day')),
    ('INV-2023-002', 2, 1, 15000.00, 'Card', datetime('now', '-1 day')),
    ('INV-2023-003', 3, 1, 3500.00, 'Transfer', datetime('now', '-2 days')),
    ('INV-2023-004', 1, 1, 8000.00, 'Cash', datetime('now', '-3 days')),
    ('INV-2023-005', 4, 1, 45000.00, 'HMO', datetime('now', '-4 days'));
