-- Add department_id and unit_id to users table
ALTER TABLE users ADD COLUMN department_id TEXT REFERENCES departments(id);
ALTER TABLE users ADD COLUMN unit_id TEXT REFERENCES wards(id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_unit_id ON users(unit_id);
