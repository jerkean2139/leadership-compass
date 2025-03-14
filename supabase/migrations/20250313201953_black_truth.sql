/*
  # Create Results Table for Compass Assessment

  1. New Tables
    - `results`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `primary_direction` (text)
      - `secondary_direction` (text)
      - `scores` (jsonb)
      - `percentages` (jsonb)

  2. Security
    - Enable RLS on `results` table
    - Add policy for anonymous users to insert results
    - Add policy for authenticated users to read their own results
*/

CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  primary_direction text NOT NULL,
  secondary_direction text NOT NULL,
  scores jsonb NOT NULL,
  percentages jsonb NOT NULL
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert results
CREATE POLICY "Anyone can insert results"
  ON results
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow users to read their own results (for future auth implementation)
CREATE POLICY "Users can read own results"
  ON results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);