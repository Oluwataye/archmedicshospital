-- Migration: Add patient deposits and wallet system
-- Created: 2025-12-05

-- Patient Wallet/Deposits table
CREATE TABLE IF NOT EXISTS patient_deposits (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    patient_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'card', 'transfer', 'bank_transfer')),
    transaction_type TEXT NOT NULL DEFAULT 'deposit' CHECK(transaction_type IN ('deposit', 'deduction', 'refund')),
    reference_number TEXT UNIQUE,
    description TEXT,
    processed_by TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('pending', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- Patient Wallet Balance table
CREATE TABLE IF NOT EXISTS patient_wallets (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    patient_id TEXT NOT NULL UNIQUE,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    last_transaction_id TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (last_transaction_id) REFERENCES patient_deposits(id)
);

-- Sales tracking by department/ward
CREATE TABLE IF NOT EXISTS sales_tracking (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    transaction_date DATE NOT NULL,
    department_id TEXT,
    unit_id TEXT,
    payment_id TEXT,
    invoice_id TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT,
    cashier_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (unit_id) REFERENCES units(id),
    FOREIGN KEY (payment_id) REFERENCES payments(id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (cashier_id) REFERENCES users(id)
);

-- Revolving fund tracking
CREATE TABLE IF NOT EXISTS revolving_funds (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    fund_name TEXT NOT NULL,
    department_id TEXT,
    unit_id TEXT,
    initial_amount DECIMAL(10, 2) NOT NULL,
    current_balance DECIMAL(10, 2) NOT NULL,
    allocated_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'depleted', 'closed')),
    managed_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (unit_id) REFERENCES units(id),
    FOREIGN KEY (managed_by) REFERENCES users(id)
);

-- Revolving fund transactions
CREATE TABLE IF NOT EXISTS revolving_fund_transactions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    fund_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('allocation', 'expenditure', 'replenishment', 'adjustment')),
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    reference_number TEXT,
    processed_by TEXT NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fund_id) REFERENCES revolving_funds(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_deposits_patient ON patient_deposits(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_deposits_date ON patient_deposits(created_at);
CREATE INDEX IF NOT EXISTS idx_patient_deposits_status ON patient_deposits(status);
CREATE INDEX IF NOT EXISTS idx_patient_wallets_patient ON patient_wallets(patient_id);
CREATE INDEX IF NOT EXISTS idx_sales_tracking_date ON sales_tracking(transaction_date);
CREATE INDEX IF NOT EXISTS idx_sales_tracking_dept ON sales_tracking(department_id);
CREATE INDEX IF NOT EXISTS idx_sales_tracking_unit ON sales_tracking(unit_id);
CREATE INDEX IF NOT EXISTS idx_sales_tracking_cashier ON sales_tracking(cashier_id);
CREATE INDEX IF NOT EXISTS idx_revolving_funds_dept ON revolving_funds(department_id);
CREATE INDEX IF NOT EXISTS idx_revolving_funds_unit ON revolving_funds(unit_id);
CREATE INDEX IF NOT EXISTS idx_revolving_fund_trans_fund ON revolving_fund_transactions(fund_id);
CREATE INDEX IF NOT EXISTS idx_revolving_fund_trans_date ON revolving_fund_transactions(transaction_date);
