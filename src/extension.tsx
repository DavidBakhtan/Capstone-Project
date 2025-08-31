import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginHost from './ext/LoginHost';
import AdminShell from './ext/AdminShell';

const mountId = 'capstone-ext-root';
const isExtPath = (p: string) => p === '/login' || p === '/admin';

function ensureRoot() {
  let el = document.getElementById(mountId) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = mountId;
    document.body.appendChild(el);
  }
  return el!;
}

function showRoot(el: HTMLDivElement, visible: boolean) {
  el.style.display = visible ? 'block' : 'none';
  if (visible) {
    el.style.position = 'fixed';
    (el.style as any).inset = '0';
    el.style.zIndex = '9999';
    el.style.background = 'transparent';
  } else {
    el.removeAttribute('style');
  }
}

async function renderForPath() {
  const path = window.location.pathname;
  const el = ensureRoot();
  const root = (el as any).__root || createRoot(el);
  (el as any).__root = root;

  const visible = isExtPath(path);
  showRoot(el, visible);

  if (!visible) {
    root.render(<></>);
    return;
  }
  if (path === '/login') {
    root.render(<LoginHost />);
  } else if (path === '/admin') {
    root.render(<AdminShell />);
  }
}

// init + SPA navigation capture
renderForPath();
window.addEventListener('popstate', renderForPath);
(['pushState','replaceState'] as const).forEach((k) => {
  const orig = (history as any)[k] as typeof history.pushState;
  (history as any)[k] = function (...args: any[]) {
    orig.apply(history, args);
    setTimeout(renderForPath, 0);
  };
});
