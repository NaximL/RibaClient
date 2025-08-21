export function isPWA(): boolean {
  const nav = window.navigator as any;

  if (nav.standalone) {
    return true;
  }  
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
}