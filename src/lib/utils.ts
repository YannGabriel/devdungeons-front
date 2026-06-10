/* ---------- XP / Level Utilities ---------- */

/** Total accumulated XP for display (level * 1000 + xp) */
export const totalXp = (level: number, xp: number) => level * 1000 + xp;

/** XP needed to reach next level (always 1000 in this system) */
export const xpToNextLevel = () => 1000;

/** Percentage progress within current level */
export const levelProgress = (xp: number) => Math.min(100, Math.round((xp / 1000) * 100));

/** Human-readable level label */
export const levelLabel = (level: number) => {
  if (level === 0) return "Recruta";
  if (level < 3)   return "Aprendiz";
  if (level < 6)   return "Desenvolvedor";
  if (level < 10)  return "Sênior";
  if (level < 15)  return "Especialista";
  return "Lendário";
};

/* ---------- Date Utilities ---------- */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));

export const formatRelative = (iso: string) => {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)    return "agora";
  if (mins < 60)   return `${mins}min atrás`;
  if (hours < 24)  return `${hours}h atrás`;
  if (days < 7)    return `${days}d atrás`;
  return formatDate(iso);
};

/* ---------- String Utilities ---------- */
export const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

export const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

/* ---------- Accuracy ---------- */
export const accuracyColor = (pct: number): "success" | "warning" | "error" => {
  if (pct >= 70) return "success";
  if (pct >= 40) return "warning";
  return "error";
};

/* ---------- Knowledge Level name map ---------- */
export const levelNameOrder: Record<string, number> = {
  "Básico":        0,
  "Intermediário": 1,
  "Avançado":      2,
};
