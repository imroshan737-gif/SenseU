import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLeaderboard, type UserProfileDetails } from "@/hooks/useLeaderboard";
import { Trophy, Flame, Target, Wind, Moon, Star, ChevronLeft, ChevronRight, Crown, Medal, Award, Loader2, Sparkles, Zap, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ParticleBackground from "@/components/ParticleBackground";

const rankColors = [
  "from-amber-400 to-yellow-600",
  "from-slate-300 to-slate-500",
  "from-amber-600 to-orange-800",
];

const rankIcons = [Crown, Medal, Award];

export default function Leaderboard() {
  const navigate = useNavigate();
  const { entries, loading, page, setPage, totalPages, totalCount, fetchUserProfile } = useLeaderboard();
  const [selectedProfile, setSelectedProfile] = useState<UserProfileDetails | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleViewProfile = async (userId: string) => {
    setProfileLoading(true);
    setProfileOpen(true);
    const profile = await fetchUserProfile(userId);
    setSelectedProfile(profile);
    setProfileLoading(false);
  };

  const getRank = (index: number) => (page - 1) * 20 + index + 1;

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2.5 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/40 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/10">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="font-orbitron text-3xl font-bold text-gradient">Leaderboard</h1>
              <p className="text-sm text-muted-foreground">{totalCount} warriors competing</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <Sparkles className="w-16 h-16 text-primary/30 mx-auto" />
            <p className="text-xl text-muted-foreground font-orbitron">No warriors yet</p>
            <p className="text-muted-foreground/60">Complete sessions to claim your spot!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Top 3 podium (first page only) */}
            {page === 1 && entries.length >= 1 && (
              <div className={cn("grid gap-3 mb-8", entries.length >= 3 ? "grid-cols-3" : entries.length === 2 ? "grid-cols-2 max-w-lg mx-auto" : "grid-cols-1 max-w-xs mx-auto")}>
                {(entries.length >= 3 ? [1, 0, 2] : entries.length === 2 ? [0, 1] : [0]).map((idx) => {
                  const entry = entries[idx];
                  if (!entry) return null;
                  const rank = idx + 1;
                  const RankIcon = rankIcons[rank - 1];
                  const sizes = rank === 1 ? "pt-0" : "pt-6";
                  return (
                    <button
                      key={entry.user_id}
                      onClick={() => handleViewProfile(entry.user_id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-[1.03]",
                        "bg-gradient-to-b from-muted/40 to-muted/10 border-amber-500/20 hover:border-amber-500/50",
                        sizes
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-background font-orbitron font-bold",
                        rankColors[rank - 1]
                      )}>
                        <RankIcon className="w-6 h-6" />
                      </div>
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/30">
                        {entry.avatar_url ? (
                          <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="text-lg font-orbitron text-primary">{(entry.display_name || "?")[0].toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-foreground truncate max-w-full">{entry.display_name || "Anonymous"}</p>
                      <p className="text-xs text-amber-400 font-orbitron font-bold">{entry.total_points.toLocaleString()} pts</p>
                      <p className="text-[10px] text-muted-foreground">{entry.total_sessions} sessions</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* List */}
            {entries.map((entry, i) => {
              const rank = getRank(i);
              // Skip top 3 on first page (shown in podium)
              if (page === 1 && rank <= Math.min(3, entries.length)) return null;
              const isTopThree = rank <= 3;
              const RankIcon = isTopThree ? rankIcons[rank - 1] : null;

              return (
                <button
                  key={entry.user_id}
                  onClick={() => handleViewProfile(entry.user_id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group hover:scale-[1.01]",
                    "bg-muted/10 border-border/30 hover:border-primary/30 hover:bg-muted/20"
                  )}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm shrink-0 bg-muted/30 text-muted-foreground border border-border/30">
                    {rank}
                  </div>

                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-border/30 group-hover:border-primary/40 transition-colors">
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-xs font-orbitron text-primary">{(entry.display_name || "?")[0].toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {entry.display_name || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="truncate">{entry.most_practiced}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span>{entry.total_sessions} sessions</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-orbitron font-bold text-primary">{entry.total_points.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">pts</p>
                  </div>
                </button>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-lg bg-muted/30 border border-border/30 disabled:opacity-30 hover:border-primary/30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce((acc: (number | "...")[], p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className="text-muted-foreground/40 px-1">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={cn(
                          "w-10 h-10 rounded-lg font-orbitron text-sm font-bold transition-all",
                          page === p
                            ? "bg-primary text-primary-foreground border border-primary shadow-lg shadow-primary/30"
                            : "bg-muted/20 border border-border/30 text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-lg bg-muted/30 border border-border/30 disabled:opacity-30 hover:border-primary/30 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-primary/20">
          {profileLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : selectedProfile ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-orbitron text-gradient text-lg">Player Profile</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-primary/40 shadow-lg shadow-primary/20">
                  {selectedProfile.avatar_url ? (
                    <img src={selectedProfile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <span className="text-2xl font-orbitron text-primary">{(selectedProfile.display_name || "?")[0].toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-orbitron font-bold text-foreground">{selectedProfile.display_name || "Anonymous"}</h3>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="font-orbitron text-amber-400 font-bold">{selectedProfile.total_points.toLocaleString()} pts</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Sessions", value: selectedProfile.total_sessions, icon: Sparkles, color: "text-primary" },
                  { label: "Most Practiced", value: selectedProfile.most_practiced, icon: Target, color: "text-emerald-400" },
                  { label: "Current Streak", value: `${selectedProfile.current_streak} 🔥`, icon: Flame, color: "text-orange-400" },
                  { label: "Best Streak", value: `${selectedProfile.best_streak} ⚡`, icon: Zap, color: "text-amber-400" },
                  { label: "Breathe", value: selectedProfile.breathe_sessions, icon: Wind, color: "text-cyan-400" },
                  { label: "Focus", value: selectedProfile.focus_sessions, icon: Target, color: "text-green-400" },
                  { label: "Rest", value: selectedProfile.rest_sessions, icon: Moon, color: "text-violet-400" },
                  { label: "Relax", value: selectedProfile.relax_sessions, icon: Star, color: "text-pink-400" },
                ].map(stat => (
                  <div key={stat.label} className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center gap-2">
                    <stat.icon className={cn("w-4 h-4 shrink-0", stat.color)} />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                      <p className="text-sm font-orbitron font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedProfile.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground mb-3">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.achievements.map((ach, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-1.5">
                        <span>{ach.icon || "🏅"}</span>
                        <span className="font-medium text-amber-300">{ach.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">Profile not found</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
