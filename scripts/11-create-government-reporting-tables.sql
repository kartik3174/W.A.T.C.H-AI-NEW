-- Government Reporting & Compliance Tables

-- Government reports table
CREATE TABLE IF NOT EXISTS government_reports (
  id SERIAL PRIMARY KEY,
  report_type VARCHAR(100) NOT NULL,
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  organization_name VARCHAR(255),
  submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  submission_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft',
  file_path VARCHAR(500),
  file_type VARCHAR(50),
  biodiversity_data JSONB,
  conservation_activities JSONB,
  threat_assessment JSONB,
  compliance_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Population report metrics table
CREATE TABLE IF NOT EXISTS population_report_metrics (
  id SERIAL PRIMARY KEY,
  government_report_id INTEGER REFERENCES government_reports(id) ON DELETE CASCADE,
  species_id INTEGER REFERENCES species(id) ON DELETE SET NULL,
  population_count INTEGER,
  change_from_last_period DECIMAL(5, 2),
  conservation_status VARCHAR(50),
  habitat_condition VARCHAR(50),
  threats_identified JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Threat report data table
CREATE TABLE IF NOT EXISTS threat_report_data (
  id SERIAL PRIMARY KEY,
  government_report_id INTEGER REFERENCES government_reports(id) ON DELETE CASCADE,
  threat_type VARCHAR(100) NOT NULL,
  threat_level VARCHAR(20),
  affected_species JSONB,
  incidents_reported INTEGER,
  mitigation_actions JSONB,
  effectiveness_percent DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conservation funding table
CREATE TABLE IF NOT EXISTS conservation_funding (
  id SERIAL PRIMARY KEY,
  government_report_id INTEGER REFERENCES government_reports(id) ON DELETE CASCADE,
  funding_source VARCHAR(255),
  amount_allocated DECIMAL(15, 2),
  amount_spent DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  fiscal_year INTEGER,
  project_name VARCHAR(255),
  project_objectives TEXT,
  outcomes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Compliance checklist table
CREATE TABLE IF NOT EXISTS compliance_checklist (
  id SERIAL PRIMARY KEY,
  government_report_id INTEGER REFERENCES government_reports(id) ON DELETE CASCADE,
  requirement_category VARCHAR(100),
  requirement_description TEXT,
  is_compliant BOOLEAN,
  compliance_evidence TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wildlife statistics table
CREATE TABLE IF NOT EXISTS wildlife_statistics (
  id SERIAL PRIMARY KEY,
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  statistic_year INTEGER NOT NULL,
  statistic_month INTEGER,
  recorded_incidents INTEGER DEFAULT 0,
  successful_rescues INTEGER DEFAULT 0,
  mortality_count INTEGER DEFAULT 0,
  birth_count INTEGER DEFAULT 0,
  rehabilitation_cases INTEGER DEFAULT 0,
  rehabilitation_success_rate DECIMAL(5, 2),
  habitat_hectares_protected DECIMAL(15, 2),
  human_wildlife_conflicts INTEGER DEFAULT 0,
  mitigation_success_percent DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Policy compliance log table
CREATE TABLE IF NOT EXISTS policy_compliance_log (
  id SERIAL PRIMARY KEY,
  government_report_id INTEGER REFERENCES government_reports(id) ON DELETE CASCADE,
  policy_name VARCHAR(255),
  effective_date DATE,
  compliance_status VARCHAR(20),
  implementation_notes TEXT,
  responsible_department VARCHAR(255),
  last_audit_date DATE,
  next_audit_due DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Export templates table
CREATE TABLE IF NOT EXISTS export_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(255) NOT NULL,
  template_type VARCHAR(50),
  format VARCHAR(50),
  fields JSONB,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  is_default BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Report history table (for audit trail)
CREATE TABLE IF NOT EXISTS report_history (
  id SERIAL PRIMARY KEY,
  government_report_id INTEGER REFERENCES government_reports(id) ON DELETE CASCADE,
  version INTEGER,
  changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  changes JSONB,
  change_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_government_reports_type ON government_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_government_reports_status ON government_reports(status);
CREATE INDEX IF NOT EXISTS idx_government_reports_submitted ON government_reports(submission_date DESC);
CREATE INDEX IF NOT EXISTS idx_population_report_metrics_report ON population_report_metrics(government_report_id);
CREATE INDEX IF NOT EXISTS idx_population_report_metrics_species ON population_report_metrics(species_id);
CREATE INDEX IF NOT EXISTS idx_threat_report_data_report ON threat_report_data(government_report_id);
CREATE INDEX IF NOT EXISTS idx_threat_report_data_type ON threat_report_data(threat_type);
CREATE INDEX IF NOT EXISTS idx_conservation_funding_report ON conservation_funding(government_report_id);
CREATE INDEX IF NOT EXISTS idx_conservation_funding_year ON conservation_funding(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_wildlife_statistics_species_year ON wildlife_statistics(species_id, statistic_year);
CREATE INDEX IF NOT EXISTS idx_export_templates_type ON export_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_report_history_report ON report_history(government_report_id);
