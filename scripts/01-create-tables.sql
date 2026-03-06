-- Create species table
CREATE TABLE IF NOT EXISTS species (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  scientific_name VARCHAR(255),
  conservation_status VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tag_id VARCHAR(100) UNIQUE NOT NULL,
  species_id INTEGER REFERENCES species(id),
  gender VARCHAR(20),
  age_estimate VARCHAR(50),
  health_status VARCHAR(50) DEFAULT 'Good',
  last_seen TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create tracking_data table
CREATE TABLE IF NOT EXISTS tracking_data (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER REFERENCES animals(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  altitude DECIMAL(10, 2),
  speed DECIMAL(10, 2),
  battery_level INTEGER,
  temperature DECIMAL(5, 2),
  recorded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER REFERENCES animals(id) ON DELETE CASCADE,
  alert_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  message TEXT NOT NULL,
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Create zones table for geofencing
CREATE TABLE IF NOT EXISTS zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  zone_type VARCHAR(50),
  description TEXT,
  coordinates JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_animals_species ON animals(species_id);
CREATE INDEX IF NOT EXISTS idx_animals_tag ON animals(tag_id);
CREATE INDEX IF NOT EXISTS idx_tracking_animal ON tracking_data(animal_id);
CREATE INDEX IF NOT EXISTS idx_tracking_time ON tracking_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_animal ON alerts(animal_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
