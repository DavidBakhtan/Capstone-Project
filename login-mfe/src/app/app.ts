// src/app/app.component.ts
import { Component } from '@angular/core';
import { LoginElementComponent } from './login-element.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginElementComponent],
  template: `<angular-login-app></angular-login-app>`
})
export class AppComponent {}
