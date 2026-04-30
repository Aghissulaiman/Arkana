declare module "nprogress" {
  const NProgress: {
    configure(config: { showSpinner?: boolean; trickleSpeed?: number; minimum?: number }): void;
    start(): void;
    done(force?: boolean): void;
  };

  export default NProgress;
}

declare global {
  interface Window {
    NProgress: typeof import("nprogress");
  }
}
