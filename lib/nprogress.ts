import NProgress from "nprogress";

interface WindowWithNProgress extends Window {
  NProgress?: typeof NProgress;
}

if (typeof window !== "undefined") {
  const win = window as WindowWithNProgress;
  win.NProgress = NProgress;
}

export default NProgress;
