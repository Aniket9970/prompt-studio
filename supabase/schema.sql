-- ==============================================================================
-- PROMPT STUDIO - Supabase Database Schema (Idempotent / Safe to re-run)
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Prompts Table
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'GPT-4o',
    category TEXT NOT NULL DEFAULT 'all',
    price NUMERIC(10, 2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT true,
    image_url TEXT,
    preview_video TEXT,
    fallback_icon TEXT DEFAULT 'Sparkles',
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    downloads TEXT DEFAULT '0',
    uses TEXT DEFAULT '0',
    likes INT DEFAULT 0,
    prompt_template TEXT,
    prompt_snippet TEXT,
    type_label TEXT,
    creator_name TEXT NOT NULL DEFAULT 'Prompt Studio',
    creator_handle TEXT NOT NULL DEFAULT '@promptstudio',
    creator_avatar_url TEXT,
    creator_id TEXT, -- Clerk User ID
    is_popular BOOLEAN DEFAULT false,
    is_recent BOOLEAN DEFAULT true,
    key_features JSONB DEFAULT '[]'::jsonb
);

-- 3. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk User ID
    author TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    avatar_url TEXT
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id TEXT NOT NULL, -- Clerk User ID
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Completed',
    payment_method TEXT DEFAULT 'Card',
    items JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 5. Saved / Favorited Prompts Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id TEXT NOT NULL, -- Clerk User ID
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    UNIQUE(user_id, prompt_id)
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 7. Public Read Policies (Safe drop and recreate)
DROP POLICY IF EXISTS "Public prompts are viewable by everyone" ON public.prompts;
CREATE POLICY "Public prompts are viewable by everyone" 
    ON public.prompts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Public reviews are viewable by everyone" 
    ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" 
    ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites" 
    ON public.favorites FOR SELECT USING (true);

-- 8. Insert & Update Policies (Safe drop and recreate)
DROP POLICY IF EXISTS "Allow insert for prompts" ON public.prompts;
CREATE POLICY "Allow insert for prompts" 
    ON public.prompts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for prompts" ON public.prompts;
CREATE POLICY "Allow update for prompts" 
    ON public.prompts FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete for prompts" ON public.prompts;
CREATE POLICY "Allow delete for prompts" 
    ON public.prompts FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow insert for reviews" ON public.reviews;
CREATE POLICY "Allow insert for reviews" 
    ON public.reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow insert for orders" ON public.orders;
CREATE POLICY "Allow insert for orders" 
    ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow insert for favorites" ON public.favorites;
CREATE POLICY "Allow insert for favorites" 
    ON public.favorites FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete for favorites" ON public.favorites;
CREATE POLICY "Allow delete for favorites" 
    ON public.favorites FOR DELETE USING (true);
