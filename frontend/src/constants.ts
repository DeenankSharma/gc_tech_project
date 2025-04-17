import { HistoryItem } from "./types/types";

export const API_BASE_URL = import.meta.env.VITE_BASE_URL;
export const GEMINI_API_KEY=import.meta.env.VITE_GEMINI_API_KEY;

export const sportCategories = [
  {
    id: 'football',
    name: 'Football',
    description: 'Follow matches, transfers, and news from top leagues worldwide',
    icon: '⚽'
  },
  {
    id: 'basketball',
    name: 'Basketball',
    description: 'NBA, EuroLeague, and international basketball competitions',
    icon: '🏀'
  },
  {
    id: 'cricket',
    name: 'Cricket',
    description: 'Test matches, ODIs, T20s, and major tournaments',
    icon: '🏏'
  },
  {
    id: 'tennis',
    name: 'Tennis',
    description: 'Grand Slams, ATP, WTA tours and player updates',
    icon: '🎾'
  },
  {
    id: 'f1',
    name: 'Formula 1',
    description: 'Race results, driver standings, and team news',
    icon: '🏎️'
  },
  {
    id: 'baseball',
    name: 'Baseball',
    description: 'MLB, international games, and player transfers',
    icon: '⚾'
  },
  {
    id: 'golf',
    name: 'Golf',
    description: 'PGA Tour, European Tour, and major championships',
    icon: '⛳'
  },
  {
    id: 'hockey',
    name: 'Hockey',
    description: 'NHL, international tournaments and highlights',
    icon: '🏒'
  }
];

export const historyItems: HistoryItem[] = [
  { id: 1, title: "Travel recommendations", time: "2 hours ago" },
  { id: 2, title: "Recipe ideas", time: "Yesterday" },
  { id: 3, title: "Coding help", time: "3 days ago" },
  { id: 4, title: "Book suggestions", time: "Last week" },
];

export const banners = [
  { id: "1", type: "info", title: "Welcome", message: "Welcome to our platform!" },
  { id: "2", type: "promo", title: "Discount", message: "Get 20% off on your next purchase.", actionText: "Shop Now" },
  { id: "3", type: "update", title: "System Update", message: "Scheduled maintenance at midnight." },
];