-- Insert sample cameras
INSERT INTO cameras (name, location, location_description, camera_type, status, threshold_value, last_maintenance) VALUES
('North Gate Camera', POINT(36.8300, -1.2850), 'Main entrance monitoring zone', 'Motion Detection', 'Active', 80, NOW() - INTERVAL '15 days'),
('Waterhole Cam 1', POINT(36.8200, -1.2950), 'Primary waterhole observation point', 'Thermal Imaging', 'Active', 75, NOW() - INTERVAL '10 days'),
('East Border Patrol', POINT(36.8350, -1.2800), 'Eastern boundary surveillance', 'Motion Detection', 'Active', 70, NOW() - INTERVAL '5 days'),
('South Ridge Lookout', POINT(36.8150, -1.3000), 'Mountain ridge monitoring', 'Night Vision', 'Active', 85, NOW() - INTERVAL '20 days'),
('Central Plains Cam', POINT(36.8250, -1.2900), 'Open grassland monitoring', 'Motion Detection', 'Maintenance', 75, NOW() - INTERVAL '30 days'),
('West Forest Trail', POINT(36.8100, -1.2920), 'Forest path surveillance', 'Motion Detection', 'Active', 80, NOW() - INTERVAL '8 days'),
('River Crossing Cam', POINT(36.8280, -1.2880), 'River crossing observation', 'Thermal Imaging', 'Active', 90, NOW() - INTERVAL '12 days'),
('Habitat Zone A', POINT(36.8220, -1.2940), 'Protected habitat monitoring', 'Night Vision', 'Active', 85, NOW() - INTERVAL '18 days')
ON CONFLICT DO NOTHING;
