export const WSOL_ADDRESS = "So11111111111111111111111111111111111111112";
export const SOL_ADDRESS = "SOL";
export const REFERRAL_ACCOUNT = "1LKb4CA2jTm6aFAFCAsZGvnwR7HLpD69Rm5zmFdqQje";
export const RankTypes = {
  Gaming: "Gaming",
  Trading: "Trading",
};
export const QuestTypes = {
  Daily: "Daily",
  Referral: "Referral",
  Holder: "Holder",
  Social: "Social",
};

export const TokenGroups = {
  all: "all",
  stable: "stable-coin",
  partner: "partner",
  normal: "jupiter-strict",
};

export const UserRoles = {
  tester: "tester",
  userSend: "user-send",
  userMonke: "user-monke",
};

export const LogTypes = {
  game: "game",
};
export const EVENT_DISPLAY_CODE = "CONTEST_S3";
export const LEVEL_COLORS = [
  "#F0E9CF",
  "#197FEF",
  "#F1C315",
  "#00FF97",
  "#BC88FF",
];

export const PerkLabel = {
  HP: "Health",
  Armor: "Armor",
  Speed: "Speed",
  Luck: "Luck",
};

export const PerkColor = {
  HP: "#FF6200",
  Armor: "#F1C315",
  Speed: "#197FEF",
  Luck: "#00FF97",
};

export const boostTable = {
  0: { HP: 0, Armor: 0, Speed: 0, Luck: 0 },
  1: { HP: 2, Armor: 3, Speed: 2, Luck: 2 },
  2: { HP: 5, Armor: 8, Speed: 5, Luck: 5 },
  3: { HP: 10, Armor: 15, Speed: 10, Luck: 10 },
  4: { HP: 20, Armor: 30, Speed: 20, Luck: 20 },
  5: { HP: 200, Armor: 200, Speed: 50, Luck: 100 },
};

export const USDC = {
  address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  swapAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
};

export const SOL = {
  address: "SOL",
  name: "Solana",
  symbol: "SOL",
  decimals: 9,
  icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  swapAddress: "So11111111111111111111111111111111111111112",
};

export const DATE_FORMAT = "DD MMM";

export const ENERGY_PER_DAY = 5;
export const ENERGY_BONUS = 3;
export const GAME_PASS_MIN_AMOUNT = 0.01;

export const BONUS_HOLDING_LEVELS = [
  { level: 1, threshold: 100, energy: 1, points: 500 },
  { level: 2, threshold: 500, energy: 3, points: 1000 },
  { level: 3, threshold: 3000, energy: 5, points: 3000 },
];
export const ENERGY_PACKAGES = [
  {
    amount: 0.03,
    bonus: 25,
    bonusToken: 3,
    label: "Basic",
    tier: 0,
    expiredIn: 3000,
    type: "Energy",
  },
  {
    amount: 0.15,
    bonus: 50,
    bonusToken: 15,
    label: "Popular",
    tier: 1,
    expiredIn: 3,
    type: "Energy",
  },
  {
    amount: 0.25,
    bonus: 100,
    bonusToken: 40,
    label: "Premium",
    tier: 2,
    expiredIn: 7,
    type: "Energy",
  },
];

export const MULTIPLY_PACKAGES = [
  {
    amount: 0.03,
    bonus: 2,
    bonusToken: 3,
    label: "Basic",
    tier: 0,
    expiredIn: 1,
    type: "Multiply",
  },
  {
    amount: 0.15,
    bonus: 3,
    bonusToken: 15,
    label: "Popular",
    tier: 1,
    expiredIn: 5,
    type: "Multiply",
  },
  {
    amount: 0.25,
    bonus: 5,
    bonusToken: 40,
    label: "Premium",
    tier: 2,
    expiredIn: 7,
    type: "Multiply",
  },
];
