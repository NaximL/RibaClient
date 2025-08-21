import { Platform } from "react-native";

export function isPWA(): boolean {
  if (Platform.OS !== 'web') return true;

  const nav = window.navigator as any;

  if (nav.standalone) {
    return true;
  }  
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
}