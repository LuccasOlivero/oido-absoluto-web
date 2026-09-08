-- Enable Row Level Security (RLS) on tables leaderboard and profiles
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Leaderboard: Public can select.
CREATE POLICY "Public can select leaderboard" ON public.leaderboard
    FOR SELECT USING (true);

-- Leaderboard: Users can insert and update ONLY their own score (auth.uid() = user_id).
CREATE POLICY "Users can insert their own score" ON public.leaderboard
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own score" ON public.leaderboard
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Profiles: Public can select.
CREATE POLICY "Public can select profiles" ON public.profiles
    FOR SELECT USING (true);

-- Profiles: Users can update ONLY their own profile (auth.uid() = id).
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
