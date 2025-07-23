import { boostTable } from "@/app/constants";

export function formatNumber(num, separator = ",") {
  if (typeof num !== "number") return "--";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function roundToDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
export function ceilToDecimals(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}

export const sround = (x, s) => {
  if (x < 0) {
    return -sround(-x, s);
  }
  if (x === 0) {
    return 0;
  }
  if (x > 1) {
    return roundToDecimals(x, s);
  }
  const digits = Math.ceil(s - 1 - Math.log10(x));
  return roundToDecimals(x, digits);
};

export const hasValue = (value, options = {}) => {
  const {
    allowZero = true,
    allowFalse = true,
    allowEmptyString = true,
    allowEmptyArray = true,
    allowEmptyObject = true,
  } = options;

  if (value === null || value === undefined) return false;
  if (!allowZero && value === 0) return false;
  if (!allowFalse && value === false) return false;
  if (!allowEmptyString && typeof value === "string" && value.trim() === "")
    return false;
  if (!allowEmptyArray && Array.isArray(value) && value.length === 0)
    return false;
  if (
    !allowEmptyObject &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
    return false;

  return true;
};
export const shortAddress = (addr = "", n = 5, align = "center") => {
  if (!(addr && addr.length > n)) return addr;
  if (align === "center") return `${addr.slice(0, n)}...${addr.slice(-n)}`;
  if (align === "right") return `${addr.slice(0, -n)}...`;
  if (align === "left") return `...${addr.slice(0, n)}`;
  return addr;
};

export const calcBoostPoint = (P, D) => {
  if (P <= 0) return 0;
  return P ** 2 / D;
};

export const convertBoostToLevel = (B) => {
  if (B <= 0) return 0;
  if (B < 1) return 1;
  if (B < 10) return 2;
  if (B < 100) return 3;
  return 4;
};

export const calcBoostStats = (boostStatus, P, D) => {
  const B = calcBoostPoint(P, D);
  const L = convertBoostToLevel(B);
  const rawBonus = boostTable[L];

  const bonus = {};
  const allBoostKeys = Object.keys(boostTable[0]); // ['HP', 'Armor', 'Speed', 'Luck']

  for (const key of allBoostKeys) {
    bonus[key] = boostStatus?.[key] ? rawBonus[key] : 0;
  }

  return bonus;
};

export const getPnlToNextLevel = (P, D) => {
  const currentBoost = calcBoostPoint(P, D);
  const currentLevel = convertBoostToLevel(currentBoost);

  if (currentLevel >= 4) {
    return 0;
  }

  const nextLevelRequiredBoost = [0.001, 1, 10, 100][currentLevel];
  const requiredP = Math.sqrt(nextLevelRequiredBoost * D);
  return Math.max(0, requiredP - P);
};

export const getBoostDetails = (boostStatus, P, D) => {
  const currentBoost = calcBoostPoint(P, D);
  const currentLevel = convertBoostToLevel(currentBoost);
  const boostStats = calcBoostStats(boostStatus, P, D);
  const pnlToNextLevel = getPnlToNextLevel(P, D);
  const perk = Object.entries(boostStatus)?.find(([_, value]) => value)?.[0];
  return {
    boostStatus,
    boostStats,
    currentLevel,
    pnlToNextLevel,
    perk,
  };
};