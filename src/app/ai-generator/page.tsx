"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Tab = "names" | "taglines";
type Vibe = "professional" | "playful" | "techy" | "minimal";

const SUFFIXES = ["ify", "ly", "io", "hub", "lab", "scape", "nest", "mint", "forge", "craft", "wave", "pulse", "spark", "flux", "zen", "nova"];
const PREFIXES = ["go", "get", "try", "my", "the", "one", "all", "pro", "super", "ultra"];

const INDUSTRY_WORDS: Record<string, { actions: string[]; nouns: string[]; adjectives: string[]; verbs: string[] }> = {
  default: {
    actions: ["Build", "Create", "Launch", "Grow", "Scale", "Transform", "Elevate", "Power", "Drive", "Unlock"],
    nouns: ["future", "vision", "growth", "success", "innovation", "ideas", "potential", "results", "impact", "excellence"],
    adjectives: ["smart", "modern", "simple", "better", "fastest", "easiest", "boldest", "trusted", "proven", "ultimate"],
    verbs: ["build", "create", "grow", "scale", "innovate", "connect", "deliver", "achieve", "discover", "transform"],
  },
  technology: {
    actions: ["Code", "Ship", "Deploy", "Build", "Hack", "Debug", "Scale", "Sync", "Stream", "Compute"],
    nouns: ["code", "data", "cloud", "stack", "platform", "systems", "networks", "APIs", "pipelines", "infrastructure"],
    adjectives: ["scalable", "blazing", "seamless", "intelligent", "automated", "cloud-native", "real-time", "secure", "modular", "open-source"],
    verbs: ["deploy", "scale", "automate", "integrate", "optimize", "accelerate", "streamline", "monitor", "iterate", "ship"],
  },
  food: {
    actions: ["Taste", "Savor", "Cook", "Serve", "Bite", "Feast", "Craft", "Blend", "Bake", "Brew"],
    nouns: ["flavor", "taste", "kitchen", "table", "recipes", "ingredients", "dishes", "meals", "bites", "culinary arts"],
    adjectives: ["fresh", "artisan", "homemade", "organic", "delicious", "handcrafted", "gourmet", "wholesome", "savory", "farm-to-table"],
    verbs: ["taste", "cook", "savor", "craft", "blend", "serve", "nourish", "indulge", "discover", "share"],
  },
  health: {
    actions: ["Heal", "Thrive", "Breathe", "Move", "Restore", "Balance", "Nourish", "Energize", "Renew", "Strengthen"],
    nouns: ["wellness", "health", "vitality", "balance", "strength", "mindfulness", "energy", "recovery", "fitness", "well-being"],
    adjectives: ["natural", "holistic", "vital", "balanced", "restorative", "mindful", "energizing", "therapeutic", "empowering", "nourishing"],
    verbs: ["heal", "thrive", "restore", "balance", "energize", "strengthen", "nurture", "empower", "revitalize", "transform"],
  },
  finance: {
    actions: ["Save", "Invest", "Grow", "Earn", "Trade", "Fund", "Bank", "Secure", "Profit", "Compound"],
    nouns: ["wealth", "capital", "returns", "portfolio", "assets", "savings", "investments", "finances", "markets", "freedom"],
    adjectives: ["secure", "smart", "trusted", "transparent", "profitable", "effortless", "reliable", "strategic", "automated", "flexible"],
    verbs: ["invest", "save", "grow", "earn", "trade", "manage", "optimize", "protect", "diversify", "compound"],
  },
  education: {
    actions: ["Learn", "Teach", "Study", "Master", "Explore", "Discover", "Practice", "Mentor", "Train", "Grow"],
    nouns: ["knowledge", "learning", "skills", "courses", "lessons", "education", "minds", "students", "mastery", "wisdom"],
    adjectives: ["interactive", "engaging", "personalized", "comprehensive", "accessible", "innovative", "immersive", "expert-led", "self-paced", "transformative"],
    verbs: ["learn", "teach", "master", "explore", "discover", "practice", "grow", "excel", "advance", "achieve"],
  },
};

function getIndustryWords(industry: string) {
  const key = Object.keys(INDUSTRY_WORDS).find(k => industry.toLowerCase().includes(k));
  return INDUSTRY_WORDS[key || "default"];
}

function dropVowels(word: string): string {
  if (word.length <= 3) return word;
  return word[0] + word.slice(1).replace(/[aeiou]/gi, "");
}

function generateNames(keywords: string[], vibe: Vibe): string[] {
  const names = new Set<string>();
  const kws = keywords.map(k => k.toLowerCase().trim()).filter(Boolean);
  if (kws.length === 0) return [];

  for (const kw of kws) {
    // Keyword + suffix
    for (const s of SUFFIXES) {
      const name = kw + s;
      names.add(name);
    }
    // Prefix + keyword
    for (const p of PREFIXES) {
      names.add(p + kw);
    }
    // Drop vowels
    const dv = dropVowels(kw);
    if (dv !== kw && dv.length >= 3) {
      names.add(dv);
      names.add(dv + "ly");
      names.add(dv + "io");
    }
    // Truncate
    if (kw.length > 5) {
      names.add(kw.slice(0, 4) + "r");
      names.add(kw.slice(0, 5));
    }
  }

  // Mash two keywords together
  if (kws.length >= 2) {
    for (let i = 0; i < kws.length; i++) {
      for (let j = 0; j < kws.length; j++) {
        if (i !== j) {
          names.add(kws[i] + kws[j]);
          names.add(kws[i].slice(0, Math.ceil(kws[i].length / 2)) + kws[j]);
          names.add(kws[i] + kws[j].slice(0, Math.ceil(kws[j].length / 2)));
        }
      }
    }
  }

  // Vibe-specific modifications
  let filtered = Array.from(names).filter(n => n.length >= 3 && n.length <= 20);

  if (vibe === "professional") {
    filtered = filtered.filter(n => !["go", "get", "try", "super", "ultra"].some(p => n.startsWith(p)));
  } else if (vibe === "playful") {
    filtered.sort(() => Math.random() - 0.5);
  } else if (vibe === "techy") {
    filtered = filtered.filter(n => n.includes("io") || n.includes("ly") || n.includes("hub") || n.includes("lab") || /[^aeiou]{2,}/.test(n) || true);
  } else if (vibe === "minimal") {
    filtered = filtered.filter(n => n.length <= 10);
  }

  // Capitalize
  filtered = filtered.map(n => n.charAt(0).toUpperCase() + n.slice(1));

  // Dedupe and limit
  return [...new Set(filtered)].slice(0, 30);
}

function generateTaglines(brandName: string, industry: string): string[] {
  const words = getIndustryWords(industry);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const taglines = new Set<string>();

  const templates = [
    () => `${brandName}. ${pick(words.actions)} ${pick(words.nouns)}.`,
    () => `${pick(words.actions)} your ${pick(words.nouns)} with ${brandName}.`,
    () => `The ${pick(words.adjectives)} way to ${pick(words.verbs)}.`,
    () => `Where ${pick(words.nouns)} meets ${pick(words.nouns)}.`,
    () => `${brandName} — ${pick(words.adjectives)} ${pick(words.nouns)}, delivered.`,
    () => `${pick(words.actions)}. ${pick(words.actions)}. ${brandName}.`,
    () => `Your ${pick(words.nouns)}, ${pick(words.adjectives)} simple.`,
    () => `${brandName}: ${pick(words.verbs)} without limits.`,
    () => `${pick(words.adjectives)} ${pick(words.nouns)} starts here.`,
    () => `${pick(words.actions)} ${pick(words.adjectives)} ${pick(words.nouns)} with ${brandName}.`,
    () => `Think ${pick(words.adjectives)}. Think ${brandName}.`,
    () => `${brandName} — because ${pick(words.nouns)} matters.`,
    () => `${pick(words.actions)} the future of ${pick(words.nouns)}.`,
    () => `Less effort. More ${pick(words.nouns)}. ${brandName}.`,
    () => `${brandName}. ${pick(words.adjectives)}. ${pick(words.adjectives)}. Yours.`,
    () => `Redefining ${pick(words.nouns)}, one ${pick(words.nouns)} at a time.`,
    () => `${pick(words.actions)} like never before.`,
    () => `${brandName} — where ${pick(words.nouns)} comes alive.`,
  ];

  while (taglines.size < 10) {
    const t = pick(templates)();
    taglines.add(t);
    if (taglines.size >= 18) break; // safety
  }

  return Array.from(taglines).slice(0, 10);
}

export default function AIGeneratorPage() {
  const [tab, setTab] = useState<Tab>("names");

  // Name generator state
  const [industry, setIndustry] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [vibe, setVibe] = useState<Vibe>("professional");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  // Tagline generator state
  const [brandName, setBrandName] = useState("");
  const [tagIndustry, setTagIndustry] = useState("");
  const [taglines, setTaglines] = useState<string[]>([]);

  const handleGenerateNames = () => {
    const keywords = keywordsInput.split(",").map(k => k.trim()).filter(Boolean);
    if (keywords.length === 0) return;
    setGeneratedNames(generateNames(keywords, vibe));
  };

  const handleGenerateTaglines = () => {
    if (!brandName.trim()) return;
    setTaglines(generateTaglines(brandName.trim(), tagIndustry.trim()));
  };

  const handleCheck = (name: string) => {
    window.location.href = `/?q=${encodeURIComponent(name)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">AI Brand Generator</h1>
      <p className="text-muted-foreground mb-8">Generate brand names and taglines instantly — no AI API needed, runs entirely in your browser.</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-surface rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("names")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "names" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
        >
          Name Generator
        </button>
        <button
          onClick={() => setTab("taglines")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "taglines" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
        >
          Tagline Generator
        </button>
      </div>

      {tab === "names" && (
        <div className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader><CardTitle>Generate Brand Names</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Industry</label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Technology, Food, Health, Finance, Education"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Keywords (comma-separated)</label>
                <Input
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="e.g. cloud, sync, fast"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Vibe</label>
                <div className="flex gap-2 flex-wrap">
                  {(["professional", "playful", "techy", "minimal"] as Vibe[]).map(v => (
                    <button
                      key={v}
                      onClick={() => setVibe(v)}
                      className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${vibe === v ? "bg-foreground text-background" : "bg-surface text-muted-foreground hover:text-foreground border border-border"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleGenerateNames} className="rounded-xl">Generate Names</Button>
            </CardContent>
          </Card>

          {generatedNames.length > 0 && (
            <Card className="rounded-xl">
              <CardHeader><CardTitle>Generated Names ({generatedNames.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {generatedNames.map(name => (
                    <div key={name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface">
                      <span className="font-mono text-sm font-medium">{name}</span>
                      <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => handleCheck(name)}>
                        Check Availability
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {tab === "taglines" && (
        <div className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader><CardTitle>Generate Taglines</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Brand Name</label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Acme"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Industry</label>
                <Input
                  value={tagIndustry}
                  onChange={(e) => setTagIndustry(e.target.value)}
                  placeholder="e.g. Technology, Food, Health"
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleGenerateTaglines} className="rounded-xl">Generate Taglines</Button>
            </CardContent>
          </Card>

          {taglines.length > 0 && (
            <Card className="rounded-xl">
              <CardHeader><CardTitle>Tagline Suggestions</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {taglines.map((t, i) => (
                    <div key={i} className="py-2 px-3 rounded-lg bg-surface">
                      <p className="text-sm italic">&ldquo;{t}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
