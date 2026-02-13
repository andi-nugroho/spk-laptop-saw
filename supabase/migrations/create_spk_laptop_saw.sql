/*
  # SPK Laptop Selection System Schema

  1. New Tables
    - `laptops`
      - `id` (uuid, primary key)
      - `name` (text) - Nama laptop
      - `brand` (text) - Merk laptop
      - `price` (numeric) - Harga dalam rupiah
      - `ram` (integer) - RAM dalam GB
      - `processor_score` (numeric) - Skor processor (0-100)
      - `storage` (integer) - Storage dalam GB
      - `screen_size` (numeric) - Ukuran layar dalam inch
      - `created_at` (timestamptz)

    - `criteria`
      - `id` (uuid, primary key)
      - `name` (text) - Nama kriteria
      - `weight` (numeric) - Bobot kriteria (0-1)
      - `type` (text) - Tipe kriteria (benefit/cost)
      - `attribute` (text) - Nama atribut di tabel laptops
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (read/write) for demo purposes
*/

-- Create laptops table
CREATE TABLE IF NOT EXISTS laptops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  ram integer NOT NULL CHECK (ram > 0),
  processor_score numeric NOT NULL CHECK (processor_score >= 0 AND processor_score <= 100),
  storage integer NOT NULL CHECK (storage > 0),
  screen_size numeric NOT NULL CHECK (screen_size > 0),
  created_at timestamptz DEFAULT now()
);

-- Create criteria table
CREATE TABLE IF NOT EXISTS criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  weight numeric NOT NULL CHECK (weight >= 0 AND weight <= 1),
  type text NOT NULL CHECK (type IN ('benefit', 'cost')),
  attribute text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow public read access to laptops"
  ON laptops FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to laptops"
  ON laptops FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to laptops"
  ON laptops FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to laptops"
  ON laptops FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to criteria"
  ON criteria FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to criteria"
  ON criteria FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to criteria"
  ON criteria FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to criteria"
  ON criteria FOR DELETE
  TO anon
  USING (true);

-- Insert default criteria
INSERT INTO criteria (name, weight, type, attribute) VALUES
  ('Harga', 0.25, 'cost', 'price'),
  ('RAM', 0.20, 'benefit', 'ram'),
  ('Processor', 0.25, 'benefit', 'processor_score'),
  ('Storage', 0.15, 'benefit', 'storage'),
  ('Ukuran Layar', 0.15, 'benefit', 'screen_size')
ON CONFLICT (attribute) DO NOTHING;

-- Insert sample laptops
INSERT INTO laptops (name, brand, price, ram, processor_score, storage, screen_size) VALUES
  ('ThinkPad X1 Carbon', 'Lenovo', 22000000, 16, 85, 512, 14.0),
  ('MacBook Air M2', 'Apple', 18000000, 8, 90, 256, 13.6),
  ('Pavilion 14', 'HP', 8000000, 8, 65, 512, 14.0),
  ('VivoBook 15', 'Asus', 6500000, 4, 55, 256, 15.6),
  ('Inspiron 15', 'Dell', 9500000, 8, 70, 512, 15.6)
ON CONFLICT DO NOTHING;