-- Add department_id to wards table
ALTER TABLE wards ADD COLUMN department_id TEXT REFERENCES departments(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wards_department_id ON wards(department_id);
