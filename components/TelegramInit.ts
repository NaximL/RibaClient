import { useEffect } from 'react';
import { Platform } from 'react-native';

export { };

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
    // Работает только на web
    if (Platform.OS !== 'web') return;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;

    script.onload = () => {
      const tg = window.Telegram?.WebApp;


      if (!tg || !tg.initData) {
        console.warn('❌ Не в Telegram Mini App — initData отсутствует');
        return;
      }

      tg.ready();

      tg.setHeaderColor('#f7f7fa');
      tg.expand();

      if (!tg.isExpanded) {
        tg.expand();
        console.log('🖥️ Telegram WebApp expanded to fullscreen');
      }


    };

    document.body.appendChild(script);
  }, []);

  return null;
}