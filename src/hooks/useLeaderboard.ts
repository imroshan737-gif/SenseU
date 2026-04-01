import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  total_sessions: number;
  breathe_sessions: number;
  focus_sessions: number;
  rest_sessions: number;
  relax_sessions: number;
  current_streak: number;
  best_streak: number;
  last_session_at: string | null;
  most_practiced: string;
}

export interface UserProfileDetails extends LeaderboardEntry {
  achievements: { title: string; icon: string | null; earned_at: string; points: number }[];
}

function getMostPracticed(entry: { breathe_sessions: number; focus_sessions: number; rest_sessions: number; relax_sessions: number }): string {
  const map: Record<string, number> = {
    Breathe: entry.breathe_sessions,
    Focus: entry.focus_sessions,
    Rest: entry.rest_sessions,
    Relax: entry.relax_sessions,
  };
  const max = Math.max(...Object.values(map));
  if (max === 0) return "None yet";
  return Object.entries(map).find(([, v]) => v === max)?.[0] || "None yet";
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    const from = (p - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: stats, count } = await supabase
      .from("leaderboard_stats")
      .select("*", { count: "exact" })
      .order("total_points", { ascending: false })
      .range(from, to);

    if (!stats) { setLoading(false); return; }

    // Get profiles for these users
    const userIds = stats.map(s => s.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", userIds);

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

    const mapped: LeaderboardEntry[] = stats.map(s => {
      const profile = profileMap.get(s.user_id);
      return {
        user_id: s.user_id,
        display_name: profile?.display_name || "Anonymous",
        avatar_url: profile?.avatar_url || null,
        total_points: s.total_points,
        total_sessions: s.total_sessions,
        breathe_sessions: s.breathe_sessions,
        focus_sessions: s.focus_sessions,
        rest_sessions: s.rest_sessions,
        relax_sessions: s.relax_sessions,
        current_streak: s.current_streak,
        best_streak: s.best_streak,
        last_session_at: s.last_session_at,
        most_practiced: getMostPracticed(s),
      };
    });

    setEntries(mapped);
    setTotalCount(count || 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("leaderboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard_stats" }, () => {
        fetchPage(page);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        fetchPage(page);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [page, fetchPage]);

  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfileDetails | null> => {
    const [{ data: stats }, { data: profile }, { data: achievements }] = await Promise.all([
      supabase.from("leaderboard_stats").select("*").eq("user_id", userId).single(),
      supabase.from("profiles").select("*").eq("user_id", userId).single(),
      supabase.from("user_achievements").select("*").eq("user_id", userId).order("earned_at", { ascending: false }),
    ]);

    if (!stats) return null;

    return {
      user_id: userId,
      display_name: profile?.display_name || "Anonymous",
      avatar_url: profile?.avatar_url || null,
      total_points: stats.total_points,
      total_sessions: stats.total_sessions,
      breathe_sessions: stats.breathe_sessions,
      focus_sessions: stats.focus_sessions,
      rest_sessions: stats.rest_sessions,
      relax_sessions: stats.relax_sessions,
      current_streak: stats.current_streak,
      best_streak: stats.best_streak,
      last_session_at: stats.last_session_at,
      most_practiced: getMostPracticed(stats),
      achievements: (achievements || []).map(a => ({
        title: a.title,
        icon: a.icon,
        earned_at: a.earned_at,
        points: a.points,
      })),
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return { entries, loading, page, setPage, totalPages, totalCount, fetchUserProfile };
}

// Sync local points/sessions to the database
export async function syncLeaderboardStats(points: number, sessionType?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Ensure profile exists
  const { data: existingProfile } = await supabase.from("profiles").select("id").eq("user_id", user.id).single();
  if (!existingProfile) {
    const name = localStorage.getItem("neuroaura_name") || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const avatar = user.user_metadata?.avatar_url || null;
    await supabase.from("profiles").insert({ user_id: user.id, display_name: name, avatar_url: avatar });
  }

  // Upsert leaderboard stats
  const { data: existing } = await supabase.from("leaderboard_stats").select("*").eq("user_id", user.id).single();

  if (existing) {
    const update: Record<string, unknown> = {
      total_points: points,
      last_session_at: new Date().toISOString(),
    };
    if (sessionType) {
      update.total_sessions = existing.total_sessions + 1;
      if (sessionType === "breathe") update.breathe_sessions = existing.breathe_sessions + 1;
      if (sessionType === "focus") update.focus_sessions = existing.focus_sessions + 1;
      if (sessionType === "rest") update.rest_sessions = existing.rest_sessions + 1;
      if (sessionType === "relax") update.relax_sessions = existing.relax_sessions + 1;

      // Streak logic
      const lastSession = existing.last_session_at ? new Date(existing.last_session_at) : null;
      const now = new Date();
      const hoursDiff = lastSession ? (now.getTime() - lastSession.getTime()) / (1000 * 60 * 60) : 999;
      if (hoursDiff < 48) {
        update.current_streak = existing.current_streak + 1;
        update.best_streak = Math.max(existing.best_streak, (existing.current_streak + 1));
      } else {
        update.current_streak = 1;
      }
    }
    await supabase.from("leaderboard_stats").update(update).eq("user_id", user.id);
  } else {
    const insert: Record<string, unknown> = {
      user_id: user.id,
      total_points: points,
      last_session_at: new Date().toISOString(),
    };
    if (sessionType) {
      insert.total_sessions = 1;
      insert.current_streak = 1;
      insert.best_streak = 1;
      if (sessionType === "breathe") insert.breathe_sessions = 1;
      if (sessionType === "focus") insert.focus_sessions = 1;
      if (sessionType === "rest") insert.rest_sessions = 1;
      if (sessionType === "relax") insert.relax_sessions = 1;
    }
    await supabase.from("leaderboard_stats").insert(insert as { user_id: string; total_points?: number; total_sessions?: number; breathe_sessions?: number; focus_sessions?: number; rest_sessions?: number; relax_sessions?: number; current_streak?: number; best_streak?: number; last_session_at?: string });
  }
}
