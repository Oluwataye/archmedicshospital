-- Services Management Schema
-- This creates the tables needed for managing hospital services

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    department TEXT,
    base_price REAL NOT NULL,
    tax_rate REAL DEFAULT 0,
    hmo_covered INTEGER DEFAULT 0,
    hmo_price REAL,
    duration_minutes INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Service categories table
CREATE TABLE IF NOT EXISTS service_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert default service categories
INSERT OR IGNORE INTO service_categories (name, description) VALUES
    ('Clinical', 'Clinical consultations and examinations'),
    ('Laboratory', 'Laboratory tests and diagnostics'),
    ('Imaging', 'Radiology and imaging services'),
    ('Pharmacy', 'Medications and pharmaceutical products'),
    ('Ward', 'Ward and bed charges'),
    ('Emergency', 'Emergency services'),
    ('Procedure', 'Medical procedures and surgeries'),
    ('Therapy', 'Physiotherapy and rehabilitation'),
    ('Administrative', 'Administrative services and documentation');

-- Insert sample services
INSERT OR IGNORE INTO services (name, description, category, department, base_price, hmo_covered, hmo_price) VALUES
    ('General Consultation', 'General medical consultation', 'Clinical', 'General Medicine', 5000.00, 1, 4000.00),
    ('Specialist Consultation', 'Specialist doctor consultation', 'Clinical', 'Specialist', 10000.00, 1, 8000.00),
    ('Full Blood Count', 'Complete blood count test', 'Laboratory', 'Laboratory', 3500.00, 1, 3000.00),
    ('Malaria Test', 'Malaria parasite test', 'Laboratory', 'Laboratory', 2000.00, 1, 1500.00),
    ('X-Ray Chest', 'Chest X-ray imaging', 'Imaging', 'Radiology', 8000.00, 1, 6500.00),
    ('Ultrasound Scan', 'Ultrasound imaging', 'Imaging', 'Radiology', 12000.00, 1, 10000.00),
    ('CT Scan', 'Computed tomography scan', 'Imaging', 'Radiology', 45000.00, 1, 40000.00),
    ('General Ward Bed', 'General ward bed per day', 'Ward', 'Nursing', 5000.00, 1, 4500.00),
    ('Private Room', 'Private room per day', 'Ward', 'Nursing', 15000.00, 0, 0),
    ('ICU Bed', 'Intensive care unit bed per day', 'Ward', 'ICU', 50000.00, 1, 45000.00),
    ('Emergency Consultation', 'Emergency room consultation', 'Emergency', 'Emergency', 7500.00, 1, 6000.00),
    ('Minor Surgery', 'Minor surgical procedure', 'Procedure', 'Surgery', 25000.00, 1, 20000.00),
    ('Physiotherapy Session', 'Single physiotherapy session', 'Therapy', 'Physiotherapy', 8000.00, 1, 7000.00),
    ('Medical Certificate', 'Medical fitness certificate', 'Administrative', 'Admin', 2000.00, 0, 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_department ON services(department);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);
