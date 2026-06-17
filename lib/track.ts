/* Fire a custom GoatCounter event.
   Events appear in the GoatCounter dashboard's Pages list, flagged as
   events (toggle "Show events" / they're listed with the name passed
   here). Use clear, grouped names like "3d-exploded-view". */
export function track(name: string) {
  if (typeof window === "undefined") return;
  window.goatcounter?.count?.({ path: name, title: name, event: true });
}
