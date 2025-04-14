export type HistoryItem = {
  id: number;
  title: string;
  time: string;
}

export interface Banner {
  id: string;
  type: "info" | "warning" | "promo" | "update";
  title: string;
  message: string;
  isNew?: boolean;
  actionText?: string;
}

export interface BannerProps {
  title: string;
  description: string;

}

export interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}


export type PreferenceContextType = {
  preference: boolean|null;
  setPreference: (value: boolean|null) => void;
};