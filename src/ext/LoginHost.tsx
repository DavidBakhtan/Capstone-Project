import React, { useEffect, useRef, useState } from 'react';
import { loadAngularBundle } from './loadAngularBundle';

export default function LoginHost() {
  const [hasAngular, setHasAngular] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await loadAngularBundle();
      if (cancelled) return;
      const defined = ok && !!customElements.get('angular-login-app');
      setHasAngular(defined);
      if (defined && rootRef.current && !rootRef.current.querySelector('angular-login-app')) {
        const el = document.createElement('angular-login-app');
        rootRef.current.replaceChildren(el);
      }
    })();
    const t = setTimeout(() => {
      if (cancelled) return;
      const defined = !!customElements.get('angular-login-app');
      if (defined && rootRef.current && !rootRef.current.querySelector('angular-login-app')) {
        const el = document.createElement('angular-login-app');
        rootRef.current.replaceChildren(el);
        setHasAngular(true);
      }
    }, 800);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  if (hasAngular) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md"><div ref={rootRef} /></div>
      </div>
    );
  }

  // Fallback React form (يشتغل لو الباندل مش موجود)
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '');
    const password = String(fd.get('password') || '');
    try {
      const r = await fetch('/api/auth/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:'include',
        body:JSON.stringify({email,password})
      });
      const j = await r.json();
      if(!r.ok) throw new Error(j.error || 'Login failed');
      window.location.href = 'http://localhost:8082/admin';
    } catch (err:any) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">{error}</div>}
          <div>
            <label className="text-sm">Email</label>
            <input name="email" type="email" required className="w-full px-3 py-2 bg-[#0a0f1a] border border-[#233143] rounded"/>
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input name="password" type="password" required className="w-full px-3 py-2 bg-[#0a0f1a] border border-[#233143] rounded"/>
          </div>
          <button disabled={loading} className="w-full px-4 py-2 rounded bg-blue-600">{loading?'Signing in…':'Sign in'}</button>
        </form>
        <div className="text-sm opacity-70">Dev note: Email (root@site.com) / Password (admin123)</div>
      </div>
    </div>
  );
}
