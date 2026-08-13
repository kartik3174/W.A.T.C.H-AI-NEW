-- Anti-Poaching Intelligence Tables

-- Threat analysis table
CREATE TABLE IF NOT EXISTS threat_analysis (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER REFERENCES animals(id) ON DELETE CASCADE,
  threat_level VARCHAR(20) NOT NULL DEFAULT 'low',
  threat_type VARCHAR(100),
  poaching_risk_score DECIMAL(5, 2),
  movement_pattern_anomaly DECIMAL(5, 2),
  behavioral_change_score DECIMAL(5, 2),
  last_human_proximity TIMESTAMP,
  last_suspicious_activity TIMESTAMP,
  assessment_date TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Suspicious activity table
CREATE TABLE IF NOT EXISTS suspicious_activities (
  id SERIAL PRIMARY KEY,
  activity_type VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  confidence DECIMAL(3, 2),
  reported_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Patrol routes table
CREATE TABLE IF NOT EXISTS patrol_routes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  route_geojson JSONB,
  difficulty_level VARCHAR(50),
  estimated_duration INTEGER,
  optimal_time_range VARCHAR(50),
  assigned_rangers JSONB,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Patrol execution table
CREATE TABLE IF NOT EXISTS patrol_executions (
  id SERIAL PRIMARY KEY,
  patrol_route_id INTEGER REFERENCES patrol_routes(id) ON DELETE CASCADE,
  ranger_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  distance_covered DECIMAL(10, 2),
  incidents_found INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'in_progress',
  notes TEXT,
  gps_track JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Disaster events table
CREATE TABLE IF NOT EXISTS disaster_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  radius_meters DECIMAL(10, 2),
  severity VARCHAR(20) NOT NULL,
  description TEXT,
  affected_animals JSONB,
  response_status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Evacuation plans table
CREATE TABLE IF NOT EXISTS evacuation_plans (
  id SERIAL PRIMARY KEY,
  disaster_event_id INTEGER REFERENCES disaster_events(id) ON DELETE CASCADE,
  animal_id INTEGER REFERENCES animals(id) ON DELETE CASCADE,
  target_location_name VARCHAR(255),
  target_latitude DECIMAL(10, 8),
  target_longitude DECIMAL(11, 8),
  priority INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  evacuation_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_threat_analysis_animal ON threat_analysis(animal_id);
CREATE INDEX IF NOT EXISTS idx_threat_analysis_level ON threat_analysis(threat_level);
CREATE INDEX IF NOT EXISTS idx_threat_analysis_updated ON threat_analysis(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_type ON suspicious_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_status ON suspicious_activities(status);
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_created ON suspicious_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patrol_routes_status ON patrol_routes(status);
CREATE INDEX IF NOT EXISTS idx_patrol_executions_route ON patrol_executions(patrol_route_id);
CREATE INDEX IF NOT EXISTS idx_patrol_executions_ranger ON patrol_executions(ranger_id);
CREATE INDEX IF NOT EXISTS idx_patrol_executions_status ON patrol_executions(status);
CREATE INDEX IF NOT EXISTS idx_disaster_events_type ON disaster_events(event_type);
CREATE INDEX IF NOT EXISTS idx_disaster_events_status ON disaster_events(response_status);
CREATE INDEX IF NOT EXISTS idx_disaster_events_created ON disaster_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evacuation_plans_event ON evacuation_plans(disaster_event_id);
CREATE INDEX IF NOT EXISTS idx_evacuation_plans_status ON evacuation_plans(status);
