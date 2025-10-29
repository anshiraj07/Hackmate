/*
  # HackMate Finder Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `created_at` (timestamp)
    
    - `hackers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `skills` (text array)
      - `hackathon_experience` (integer)
      - `bio` (text)
      - `created_at` (timestamp)
    
    - `connections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `hacker_id` (uuid, references hackers)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own profile
    - Add policies for authenticated users to read all hackers
    - Add policies for authenticated users to create and read their own connections
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create hackers table
CREATE TABLE IF NOT EXISTS hackers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  hackathon_experience integer NOT NULL DEFAULT 0,
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hackers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all hackers"
  ON hackers FOR SELECT
  TO authenticated
  USING (true);

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hacker_id uuid NOT NULL REFERENCES hackers(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, hacker_id)
);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections"
  ON connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own connections"
  ON connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert dummy hacker data
INSERT INTO hackers (name, skills, hackathon_experience, bio) VALUES
  ('Alex Chen', ARRAY['React', 'Node.js', 'MongoDB'], 5, 'Full-stack developer passionate about building scalable web applications'),
  ('Sarah Kumar', ARRAY['Python', 'Machine Learning', 'TensorFlow'], 8, 'AI/ML engineer with experience in computer vision and NLP'),
  ('Marcus Johnson', ARRAY['React', 'TypeScript', 'GraphQL'], 3, 'Frontend specialist who loves creating beautiful user interfaces'),
  ('Emily Rodriguez', ARRAY['Java', 'Spring Boot', 'AWS'], 6, 'Backend developer with expertise in cloud architecture'),
  ('David Kim', ARRAY['Flutter', 'Dart', 'Firebase'], 4, 'Mobile app developer building cross-platform solutions')
ON CONFLICT DO NOTHING;