-- ============================================
-- HASIO DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- LODGING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.lodging (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hotel', 'apartment', 'camp', 'homestay')),
  city TEXT NOT NULL,
  city_ar TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  neighborhood_ar TEXT NOT NULL,
  price_range TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  amenities_ar TEXT[] DEFAULT '{}',
  description TEXT,
  description_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lodging ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view lodging" ON public.lodging
  FOR SELECT USING (true);

-- ============================================
-- FOOD TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.food (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'home_kitchen', 'fastfood', 'drinks')),
  cuisine TEXT NOT NULL,
  cuisine_ar TEXT NOT NULL,
  avg_price TEXT NOT NULL,
  hours TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  description_ar TEXT,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.food ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view food" ON public.food
  FOR SELECT USING (true);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('festival', 'conference', 'outdoor', 'indoor', 'seasonal')),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  location_ar TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  description_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT USING (true);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('lodging', 'food', 'event')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own favorites
CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- MOMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.moments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  note TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own moments
CREATE POLICY "Users can view own moments" ON public.moments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add moments" ON public.moments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own moments" ON public.moments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- DAY PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.day_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.day_plans ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own plans
CREATE POLICY "Users can view own plans" ON public.day_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add plans" ON public.day_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON public.day_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON public.day_plans
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lodging_type ON public.lodging(type);
CREATE INDEX IF NOT EXISTS idx_lodging_rating ON public.lodging(rating DESC);
CREATE INDEX IF NOT EXISTS idx_food_category ON public.food(category);
CREATE INDEX IF NOT EXISTS idx_food_rating ON public.food(rating DESC);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_moments_user ON public.moments(user_id);
CREATE INDEX IF NOT EXISTS idx_day_plans_user ON public.day_plans(user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lodging_updated_at
  BEFORE UPDATE ON public.lodging
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_food_updated_at
  BEFORE UPDATE ON public.food
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_day_plans_updated_at
  BEFORE UPDATE ON public.day_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
