-- Create cameras table
CREATE TABLE IF NOT EXISTS cameras (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location POINT NOT NULL,
  location_description TEXT,
  camera_type VARCHAR(100) DEFAULT 'Motion Detection',
  status VARCHAR(50) DEFAULT 'Active',
  threshold_value INTEGER DEFAULT 75,
  last_maintenance TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for camera location queries
CREATE INDEX IF NOT EXISTS idx_cameras_status ON cameras(status);
CREATE INDEX IF NOT EXISTS idx_cameras_name ON cameras(name);
