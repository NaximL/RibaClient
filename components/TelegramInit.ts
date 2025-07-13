import { useEffect } from 'react';
import { Platform } from 'react-native';
export {};

declare global {
  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: any;
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    isExpanded: boolean;
    isClosingConfirmationEnabled: boolean;
    headerColor: string;
    backgroundColor: string;
    themeParams: Record<string, string>;
    viewportHeight: number;
    isVersionAtLeast: (version: string) => boolean;
    ready: () => void;
    expand: () => void;
    close: () => void;
    sendData: (data: string) => void;
    setHeaderColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    enableClosingConfirmation: () => void;
    disableClosingConfirmation: () => void;
    onEvent: (eventType: string, callback: () => void) => void;
    offEvent: (eventType: string, callback: () => void) => void;
  }

  interface TelegramGlobal {
    WebApp: TelegramWebApp;
  }

  interface Window {
    Telegram?: TelegramGlobal;
  }
}
export default function TelegramInit() {
  useEffect(() => {
    
    if (Platform.OS !== 'web') return;

    
    const userAgent = navigator.userAgent.toLowerCase();
    const isTelegram = userAgent.includes('telegram');

    if (!isTelegram) {
      console.log('❌ Не в Telegram Mini App');
      return;
    }

    
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.setBackgroundColor('#f2f4f8');
        console.log('✅ Telegram WebApp SDK ініціалізовано');
      } else {
        console.warn('⚠️ Telegram.WebApp не знайдено');
      }
    };
  }, []);

  return null;
}