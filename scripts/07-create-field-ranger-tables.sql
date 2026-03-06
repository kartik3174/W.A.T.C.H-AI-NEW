-- Field Ranger Mode Tables
-- Supports offline incident reporting and GPS tracking

-- Ranger gps tracks table
CREATE TABLE IF NOT EXISTS ranger_gps_tracks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  altitude DECIMAL(10, 2),
  speed DECIMAL(10, 2),
  heading DECIMAL(10, 2),
  recorded_at TIMESTAMP NOT NULL,
  synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Offline incidents table (syncs when connection available)
CREATE TABLE IF NOT EXISTS offline_incidents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
  incident_type VARCHAR(100) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  severity VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  synced BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  synced_at TIMESTAMP
);

-- Ranger observations table
CREATE TABLE IF NOT EXISTS ranger_observations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
  observation_type VARCHAR(100) NOT NULL,
  notes TEXT,
  media_urls JSONB,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  confidence DECIMAL(3, 2),
  synced BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL,
  synced_at TIMESTAMP
);

-- Ranger sync history table (for debugging and audit)
CREATE TABLE IF NOT EXISTS ranger_sync_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL,
  records_synced INTEGER,
  status VARCHAR(20) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ranger_gps_user ON ranger_gps_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_ranger_gps_recorded ON ranger_gps_tracks(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_offline_incidents_user ON offline_incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_incidents_synced ON offline_incidents(synced);
CREATE INDEX IF NOT EXISTS idx_offline_incidents_created ON offline_incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_observations_user ON ranger_observations(user_id);
CREATE INDEX IF NOT EXISTS idx_observations_synced ON ranger_observations(synced);
CREATE INDEX IF NOT EXISTS idx_sync_history_user ON ranger_sync_history(user_id);
