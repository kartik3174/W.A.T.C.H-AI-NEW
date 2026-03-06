-- Smart Drone Fleet Management Tables

-- Drone units table
CREATE TABLE IF NOT EXISTS drone_units (
  id SERIAL PRIMARY KEY,
  unit_code VARCHAR(50) UNIQUE NOT NULL,
  model VARCHAR(255),
  manufacturer VARCHAR(255),
  serial_number VARCHAR(255),
  acquisition_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  battery_health_percent DECIMAL(5, 2),
  flight_hours_total DECIMAL(10, 2),
  last_maintenance_date DATE,
  next_maintenance_due DATE,
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  current_operator INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Drone missions table
CREATE TABLE IF NOT EXISTS drone_missions (
  id SERIAL PRIMARY KEY,
  drone_id INTEGER REFERENCES drone_units(id) ON DELETE SET NULL,
  mission_name VARCHAR(255) NOT NULL,
  mission_type VARCHAR(100),
  operator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  scheduled_start TIMESTAMP NOT NULL,
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  duration_minutes INTEGER,
  status VARCHAR(20) DEFAULT 'scheduled',
  objective TEXT,
  target_area_geojson JSONB,
  waypoints JSONB,
  expected_battery_usage_percent DECIMAL(5, 2),
  priority VARCHAR(20) DEFAULT 'normal',
  weather_conditions TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Drone mission results table
CREATE TABLE IF NOT EXISTS drone_mission_results (
  id SERIAL PRIMARY KEY,
  mission_id INTEGER REFERENCES drone_missions(id) ON DELETE CASCADE,
  images_captured INTEGER,
  videos_captured INTEGER,
  total_distance_covered_km DECIMAL(10, 2),
  max_altitude_meters DECIMAL(10, 2),
  anomalies_detected JSONB,
  animals_identified JSONB,
  battery_used_percent DECIMAL(5, 2),
  final_status VARCHAR(20),
  completion_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Drone battery logs table
CREATE TABLE IF NOT EXISTS drone_battery_logs (
  id SERIAL PRIMARY KEY,
  drone_id INTEGER REFERENCES drone_units(id) ON DELETE CASCADE,
  mission_id INTEGER REFERENCES drone_missions(id) ON DELETE SET NULL,
  battery_percent_before DECIMAL(5, 2),
  battery_percent_after DECIMAL(5, 2),
  charge_time_minutes INTEGER,
  cycle_count INTEGER,
  health_percent DECIMAL(5, 2),
  logged_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Drone maintenance logs table
CREATE TABLE IF NOT EXISTS drone_maintenance_logs (
  id SERIAL PRIMARY KEY,
  drone_id INTEGER REFERENCES drone_units(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(100) NOT NULL,
  description TEXT,
  technician_name VARCHAR(255),
  maintenance_date DATE NOT NULL,
  parts_replaced JSONB,
  cost DECIMAL(10, 2),
  duration_hours DECIMAL(5, 2),
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Smart geofences table
CREATE TABLE IF NOT EXISTS smart_geofences (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  geofence_type VARCHAR(50),
  boundary_geojson JSONB NOT NULL,
  priority_level VARCHAR(20) DEFAULT 'normal',
  action_on_breach VARCHAR(100),
  associated_zones JSONB,
  status VARCHAR(20) DEFAULT 'active',
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Mission optimization logs table
CREATE TABLE IF NOT EXISTS mission_optimization_logs (
  id SERIAL PRIMARY KEY,
  suggestion_type VARCHAR(100),
  current_mission_id INTEGER REFERENCES drone_missions(id) ON DELETE SET NULL,
  suggested_changes JSONB,
  estimated_efficiency_gain DECIMAL(5, 2),
  estimated_battery_saving_percent DECIMAL(5, 2),
  accepted BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_drone_units_status ON drone_units(status);
CREATE INDEX IF NOT EXISTS idx_drone_units_operator ON drone_units(current_operator);
CREATE INDEX IF NOT EXISTS idx_drone_units_maintenance ON drone_units(next_maintenance_due);
CREATE INDEX IF NOT EXISTS idx_drone_missions_drone ON drone_missions(drone_id);
CREATE INDEX IF NOT EXISTS idx_drone_missions_operator ON drone_missions(operator_id);
CREATE INDEX IF NOT EXISTS idx_drone_missions_status ON drone_missions(status);
CREATE INDEX IF NOT EXISTS idx_drone_missions_scheduled ON drone_missions(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_drone_mission_results_mission ON drone_mission_results(mission_id);
CREATE INDEX IF NOT EXISTS idx_drone_battery_logs_drone ON drone_battery_logs(drone_id);
CREATE INDEX IF NOT EXISTS idx_drone_battery_logs_logged ON drone_battery_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_drone_maintenance_logs_drone ON drone_maintenance_logs(drone_id);
CREATE INDEX IF NOT EXISTS idx_drone_maintenance_logs_date ON drone_maintenance_logs(maintenance_date DESC);
CREATE INDEX IF NOT EXISTS idx_smart_geofences_status ON smart_geofences(status);
CREATE INDEX IF NOT EXISTS idx_mission_optimization_accepted ON mission_optimization_logs(accepted);
