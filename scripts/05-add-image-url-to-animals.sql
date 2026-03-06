-- Add image_url column to animals table
ALTER TABLE animals ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing animals with sample images
UPDATE animals 
SET image_url = CASE 
  WHEN name = 'Tembo' THEN '/images/elephant.png'
  WHEN name = 'Simba' THEN '/images/lion.png'
  WHEN name = 'Kifaru' THEN '/images/rhino.png'
  WHEN name = 'Raja' THEN '/images/tiger.png'
  WHEN name = 'Zuri' THEN '/images/gorilla.png'
END
WHERE name IN ('Tembo', 'Simba', 'Kifaru', 'Raja', 'Zuri');
