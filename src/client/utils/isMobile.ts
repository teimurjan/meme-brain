export function isMobile() {
  const hasMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const hasTouch = navigator.maxTouchPoints > 0;
  const isMobile = hasMobileUA || (hasTouch && window.innerWidth < 1024);
  return isMobile;
}
