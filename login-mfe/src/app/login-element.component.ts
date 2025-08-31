import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

const API_BASE =
  (window as any).__API_BASE__ || 'http://localhost:8082'; // Apache API

const SCHEMA_URL =
  (window as any).__SCHEMA_URL__ || 'http://localhost:9090/loginForm';
/* ========================================================================= */

type FieldConfig = {
  type?: 'email' | 'password' | 'text';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};
type LoginSchema = { fields: Record<string, FieldConfig> };

@Component({
  selector: 'angular-login-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="page">
    <div class="card">
      <div class="brand">
        <div class="logo">N</div>
        <div>
          <h1>Sign in</h1>
          <p class="muted">Welcome back. Please enter your details.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <label>Email</label>
        <input type="email" formControlName="email" placeholder="you@example.com" />
        <div class="err" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
          <span *ngIf="form.get('email')?.hasError('required')">Email is required</span>
          <span *ngIf="form.get('email')?.hasError('email')">Invalid email</span>
        </div>

        <label>Password</label>
        <input type="password" formControlName="password" placeholder="••••••••" />
        <div class="err" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
          <span *ngIf="form.get('password')?.hasError('required')">Password is required</span>
          <span *ngIf="form.get('password')?.hasError('minlength')">Too short</span>
        </div>

        <button class="btn" type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>

        <p class="err" *ngIf="error">{{ error }}</p>
      </form>
    </div>
  </div>
  `,
  styles: [`
    :host { --bg:#0f172a; --card:#0b1220; --muted:#94a3b8; --txt:#e2e8f0; --accent:#6366f1; }
    .page { min-height:100vh; display:grid; place-items:center; background:
      radial-gradient(1200px 600px at -10% -10%, #1e293b, transparent),
      radial-gradient(1200px 600px at 110% 120%, #111827, transparent),
      var(--bg); color:var(--txt); padding:24px; }
    .card { width:100%; max-width:420px; background:linear-gradient(180deg,#0b1220 0%,#0b1220cc 100%);
      border:1px solid #1f2937; border-radius:16px; padding:24px; box-shadow:0 20px 50px #0006; }
    .brand { display:flex; gap:12px; align-items:center; margin-bottom:16px; }
    .logo { width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg,#6366f1,#22d3ee);
      display:grid; place-items:center; font-weight:800; color:white; }
    h1 { margin:0; font-size:22px; font-weight:700; }
    .muted { color:var(--muted); margin:0; font-size:13px; }
    .form { display:grid; gap:8px; margin-top:12px; }
    label { font-size:13px; color:#cbd5e1; }
    input { background:#0a0f1a; border:1px solid #233143; color:var(--txt);
      padding:10px 12px; border-radius:10px; outline:none; }
    input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px #3b82f633; }
    .btn { margin-top:8px; padding:12px; border:0; border-radius:12px; background:linear-gradient(135deg,#6366f1,#22d3ee);
      color:white; font-weight:600; cursor:pointer; }
    .btn[disabled] { opacity:.6; cursor:not-allowed; }
    .err { color:#ef4444; font-size:12px; min-height:16px; }
  `]
})
export class LoginElementComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.group({ email: [''], password: [''] });
  loading = false; error = '';

  async ngOnInit() {
    try {
      const cfg: LoginSchema = await fetch(SCHEMA_URL, { cache: 'no-store' }).then(r => r.json());
      this.applySchema(cfg);
    } catch {
      this.applySchema({
        fields: {
          email: { type:'email', required:true },
          password: { type:'password', required:true, minLength:6 }
        }
      });
    }
  }

  private applySchema(cfg: LoginSchema) {
    const e = cfg.fields['email'] ?? {};
    const p = cfg.fields['password'] ?? {};

    const eVal = [];
    if (e.required) eVal.push(Validators.required);
    if (e.type === 'email') eVal.push(Validators.email);
    if (e.minLength) eVal.push(Validators.minLength(e.minLength));
    if (e.maxLength) eVal.push(Validators.maxLength(e.maxLength));
    if (e.pattern)   eVal.push(Validators.pattern(e.pattern));
    this.form.get('email')!.setValidators(eVal);

    const pVal = [];
    if (p.required)  pVal.push(Validators.required);
    if (p.minLength) pVal.push(Validators.minLength(p.minLength));
    if (p.maxLength) pVal.push(Validators.maxLength(p.maxLength));
    if (p.pattern)   pVal.push(Validators.pattern(p.pattern));
    this.form.get('password')!.setValidators(pVal);

    this.form.updateValueAndValidity();
  }

  async onSubmit() {
  if (this.form.invalid) return;
  this.loading = true; this.error = '';
  try {
    const resp = await fetch('http://localhost:8082/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',            
      body: JSON.stringify(this.form.value)
    });
    if (!resp.ok) throw new Error(await resp.text());
    window.location.href = 'http://localhost:8082/admin';
  } catch (e:any) {
    this.error = e.message || 'Login failed';
  } finally {
    this.loading = false;
  }
}

}
