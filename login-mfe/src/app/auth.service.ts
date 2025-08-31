import { Injectable } from '@angular/core';

const API_BASE = (window as any).__API_BASE__ || 'http://localhost:8082';

@Injectable({ providedIn: 'root' })
export class AuthService {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || 'Login failed');
    return j;
  }

  async signup(full_name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ full_name, email, password })
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || 'Signup failed');
    return j;
  }

  async logout() {
    await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
  }
}
