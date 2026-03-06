-- Research & Conservation Analytics Tables

-- Migration patterns table
CREATE TABLE IF NOT EXISTS migration_patterns (
  id SERIAL PRIMARY KEY,
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  migration_start_date DATE,
  migration_end_date DATE,
  primary_route_geojson JSONB,
  average_distance_km DECIMAL(10, 2),
  duration_days INTEGER,
  animals_tracked INTEGER,
  success_rate DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Population analysis table
CREATE TABLE IF NOT EXISTS population_analysis (
  id SERIAL PRIMARY KEY,
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  analysis_date DATE NOT NULL,
  total_population INTEGER,
  male_count INTEGER,
  female_count INTEGER,
  juvenile_count INTEGER,
  birth_rate DECIMAL(5, 2),
  mortality_rate DECIMAL(5, 2),
  trend VARCHAR(50),
  confidence_level DECIMAL(3, 2),
  methodology TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seasonal trends table
CREATE TABLE IF NOT EXISTS seasonal_trends (
  id SERIAL PRIMARY KEY,
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  behavior VARCHAR(255),
  average_activity_level DECIMAL(5, 2),
  feeding_patterns TEXT,
  mating_activity BOOLEAN,
  migration_activity BOOLEAN,
  vulnerability_score DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conservation actions table
CREATE TABLE IF NOT EXISTS conservation_actions (
  id SERIAL PRIMARY KEY,
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  implementation_date DATE,
  completion_date DATE,
  status VARCHAR(20) DEFAULT 'planned',
  success_metrics JSONB,
  responsible_team VARCHAR(255),
  budget_allocated DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Research publications table
CREATE TABLE IF NOT EXISTS research_publications (
  id SERIAL PRIMARY KEY,
  researcher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  abstract TEXT,
  publication_date DATE,
  journal_name VARCHAR(255),
  doi VARCHAR(255),
  species_ids JSONB,
  related_animals JSONB,
  pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Environmental data table
CREATE TABLE IF NOT EXISTS environmental_data (
  id SERIAL PRIMARY KEY,
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  rainfall_mm DECIMAL(10, 2),
  wind_speed DECIMAL(5, 2),
  vegetation_index DECIMAL(5, 2),
  air_quality_index INTEGER,
  water_quality_score DECIMAL(5, 2),
  recorded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Species health metrics table
CREATE TABLE IF NOT EXISTS species_health_metrics (
  id SERIAL PRIMARY KEY,
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL,
  genetic_diversity_score DECIMAL(5, 2),
  disease_prevalence DECIMAL(5, 2),
  nutrition_status VARCHAR(50),
  habitat_quality_score DECIMAL(5, 2),
  water_availability_score DECIMAL(5, 2),
  predator_pressure_score DECIMAL(5, 2),
  overall_health_score DECIMAL(5, 2),
  concerns TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_migration_species_year ON migration_patterns(species_id, year);
CREATE INDEX IF NOT EXISTS idx_population_species_date ON population_analysis(species_id, analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_seasonal_trends_species_month ON seasonal_trends(species_id, month);
CREATE INDEX IF NOT EXISTS idx_conservation_actions_species ON conservation_actions(species_id);
CREATE INDEX IF NOT EXISTS idx_conservation_actions_status ON conservation_actions(status);
CREATE INDEX IF NOT EXISTS idx_research_publications_date ON research_publications(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_environmental_data_location ON environmental_data(location_latitude, location_longitude);
CREATE INDEX IF NOT EXISTS idx_environmental_data_recorded ON environmental_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_species_health_metrics_species_date ON species_health_metrics(species_id, assessment_date DESC);
