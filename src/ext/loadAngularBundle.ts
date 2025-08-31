export async function loadAngularBundle(): Promise<boolean> {
  if (customElements.get("angular-login-app")) return true;

  try {
    const res = await fetch("/microfrontends/angular-login/manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("no manifest");
    let files: string[] = await res.json();

    const order = ["polyfills", "zone", "runtime", "vendor", "styles", "main"];
    files.sort((a, b) => order.findIndex(k => a.includes(k)) - order.findIndex(k => b.includes(k)));

    const bust = (import.meta as any).env?.DEV ? `?t=${Date.now()}` : "";

    for (const file of files) {
      const url = `/microfrontends/angular-login/${file}${bust}`;
      await new Promise<void>((resolve, reject) => {
        if (file.endsWith(".css")) {
          const link = document.createElement("link");
          link.rel = "stylesheet"; link.href = url;
          link.onload = () => resolve(); link.onerror = reject;
          document.head.appendChild(link);
        } else {
          const s = document.createElement("script");
          s.src = url;
          s.onload = () => resolve(); s.onerror = reject;
          document.body.appendChild(s);
        }
      });
    }
    return !!customElements.get("angular-login-app");
  } catch {
    return false;
  }
}
