const STORAGE_KEY = "premiumSoftState";

type PremiumSoftState = {
  isPremium: boolean;
  expiresAt: string | null;
};

export const readPremiumSoft = (): PremiumSoftState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.isPremium !== "boolean") return null;
    return {
      isPremium: parsed.isPremium,
      expiresAt: typeof parsed.expiresAt === "string" ? parsed.expiresAt : null,
    };
  } catch {
    return null;
  }
};

export const writePremiumSoft = (profile: {
  isPremium?: boolean;
  expiresAt?: string | null;
}) => {
  if (!profile.isPremium) {
    clearPremiumSoft();
    return;
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      isPremium: true,
      expiresAt: profile.expiresAt ?? null,
    })
  );
};

export const clearPremiumSoft = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const isSoftPremium = (): boolean => {
  const cached = readPremiumSoft();
  if (!cached?.isPremium) return false;
  if (!cached.expiresAt) return true;
  return Date.parse(cached.expiresAt) > Date.now();
};
