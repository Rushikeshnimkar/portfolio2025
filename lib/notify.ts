export type AppNotice = {
  type: "success" | "error";
  message: string;
};

declare global {
  interface WindowEventMap {
    "app:notify": CustomEvent<AppNotice>;
  }
}

export function notify(type: AppNotice["type"], message: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<AppNotice>("app:notify", {
      detail: { type, message },
    })
  );
}
