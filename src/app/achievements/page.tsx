"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACHIEVEMENTS, getUnlocked, getStats, getStreak } from "@/lib/achievements";

export default function AchievementsPage() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUnlocked(getUnlocked());
    setStreak(getStreak().count);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground mt-1">
            {unlocked.length} of {ACHIEVEMENTS.length} unlocked
          </p>
        </div>
        {streak > 0 && (
          <div className="text-2xl font-bold">
            🔥 {streak} day streak!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <Card key={a.id} className={`rounded-xl transition-all ${isUnlocked ? "border-primary/50" : "opacity-50 grayscale"}`}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{a.icon}</div>
                <h3 className="font-semibold text-lg">{a.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                {isUnlocked && (
                  <span className="inline-block mt-2 text-xs text-primary font-medium">✓ Unlocked</span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
