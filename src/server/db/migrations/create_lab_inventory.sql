-- Lab Inventory Table
CREATE TABLE IF NOT EXISTS lab_inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    min_level INTEGER NOT NULL,
    max_level INTEGER NOT NULL,
    location TEXT NOT NULL,
    expiry_date TEXT,
    status TEXT NOT NULL,
    status_color TEXT NOT NULL,
    last_restock TEXT,
    unit_cost REAL DEFAULT 0,
    supplier TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    updated_by TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_lab_inventory_category ON lab_inventory(category);
CREATE INDEX IF NOT EXISTS idx_lab_inventory_status ON lab_inventory(status);
CREATE INDEX IF NOT EXISTS idx_lab_inventory_expiry ON lab_inventory(expiry_date);

-- Lab Inventory History Table (for audit trail)
CREATE TABLE IF NOT EXISTS lab_inventory_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inventory_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'restocked'
    previous_stock INTEGER,
    new_stock INTEGER,
    changed_by TEXT,
    change_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES lab_inventory(id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_history_item ON lab_inventory_history(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_date ON lab_inventory_history(created_at);
