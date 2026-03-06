-- Insert sample species
INSERT INTO species (name, scientific_name, conservation_status, description) VALUES
('African Elephant', 'Loxodonta africana', 'Endangered', 'Largest land animal, known for intelligence and social behavior'),
('Bengal Tiger', 'Panthera tigris tigris', 'Endangered', 'Majestic big cat native to the Indian subcontinent'),
('Mountain Gorilla', 'Gorilla beringei beringei', 'Endangered', 'Rare primate found in mountain forests'),
('Black Rhino', 'Diceros bicornis', 'Critically Endangered', 'Critically endangered species with two horns'),
('Snow Leopard', 'Panthera uncia', 'Vulnerable', 'Elusive big cat adapted to high mountain terrain'),
('Giant Panda', 'Ailuropoda melanoleuca', 'Vulnerable', 'Iconic bear species dependent on bamboo forests'),
('Cheetah', 'Acinonyx jubatus', 'Vulnerable', 'Fastest land animal, faces habitat loss'),
('African Lion', 'Panthera leo', 'Vulnerable', 'Social predator living in prides')
ON CONFLICT (name) DO NOTHING;

-- Insert sample animals
INSERT INTO animals (name, tag_id, species_id, gender, age_estimate, health_status, last_seen, notes) VALUES
('Mara', 'ELE-001', (SELECT id FROM species WHERE name = 'African Elephant'), 'Female', '15 years', 'Good', NOW() - INTERVAL '2 hours', 'Matriarch of her herd, very protective'),
('Raja', 'TIG-001', (SELECT id FROM species WHERE name = 'Bengal Tiger'), 'Male', '8 years', 'Excellent', NOW() - INTERVAL '4 hours', 'Dominant male in territory'),
('Koko', 'GOR-001', (SELECT id FROM species WHERE name = 'Mountain Gorilla'), 'Female', '12 years', 'Good', NOW() - INTERVAL '1 hour', 'Mother of two juveniles'),
('Thunder', 'RHI-001', (SELECT id FROM species WHERE name = 'Black Rhino'), 'Male', '20 years', 'Fair', NOW() - INTERVAL '6 hours', 'Older male, requires monitoring'),
('Ghost', 'SNO-001', (SELECT id FROM species WHERE name = 'Snow Leopard'), 'Male', '6 years', 'Good', NOW() - INTERVAL '3 hours', 'Highly elusive, rarely spotted'),
('Luna', 'PAN-001', (SELECT id FROM species WHERE name = 'Giant Panda'), 'Female', '5 years', 'Excellent', NOW() - INTERVAL '30 minutes', 'Young and healthy'),
('Flash', 'CHE-001', (SELECT id FROM species WHERE name = 'Cheetah'), 'Male', '4 years', 'Good', NOW() - INTERVAL '5 hours', 'Fast hunter, successful predator'),
('Simba', 'LIO-001', (SELECT id FROM species WHERE name = 'African Lion'), 'Male', '7 years', 'Good', NOW() - INTERVAL '2 hours', 'Pride leader')
ON CONFLICT (tag_id) DO NOTHING;

-- Insert recent tracking data
INSERT INTO tracking_data (animal_id, latitude, longitude, altitude, speed, battery_level, temperature, recorded_at)
SELECT 
  id,
  -1.2921 + (RANDOM() * 0.1 - 0.05),
  36.8219 + (RANDOM() * 0.1 - 0.05),
  1500 + (RANDOM() * 200),
  RANDOM() * 5,
  70 + (RANDOM() * 30)::INTEGER,
  22 + (RANDOM() * 8),
  NOW() - (INTERVAL '1 hour' * RANDOM() * 12)
FROM animals
LIMIT 8;

-- Insert sample alerts
INSERT INTO alerts (animal_id, alert_type, severity, message, location, latitude, longitude, status, created_at) VALUES
((SELECT id FROM animals WHERE tag_id = 'ELE-001'), 'Geofence Breach', 'high', 'Mara has crossed the protected area boundary', 'Northern Boundary', -1.2850, 36.8300, 'active', NOW() - INTERVAL '2 hours'),
((SELECT id FROM animals WHERE tag_id = 'TIG-001'), 'Low Battery', 'medium', 'Raja''s tracking collar battery below 20%', 'Sector B', -1.2900, 36.8250, 'active', NOW() - INTERVAL '4 hours'),
((SELECT id FROM animals WHERE tag_id = 'RHI-001'), 'Health Alert', 'high', 'Thunder showing signs of decreased mobility', 'Waterhole Area', -1.2950, 36.8200, 'resolved', NOW() - INTERVAL '1 day'),
((SELECT id FROM animals WHERE tag_id = 'CHE-001'), 'Unusual Activity', 'medium', 'Flash detected outside normal territory', 'Eastern Plains', -1.2800, 36.8350, 'active', NOW() - INTERVAL '5 hours');
