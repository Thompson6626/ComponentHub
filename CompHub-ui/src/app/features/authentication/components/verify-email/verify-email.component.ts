import {Component, inject, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-verify-email',
  imports: [Button, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.sass'
})
export class VerifyEmailComponent implements OnInit {

  private _authService = inject(AuthService)
  private _activatedRoute = inject(ActivatedRoute)

  failure = false;
  success = false;

  ngOnInit(): void {
    this.verifyEmail();
  }

  async verifyEmail(): Promise<void> {
    const token = this._activatedRoute.snapshot.paramMap.get('token');

    if (!token) {
      this.failure = true;
      return;
    }

    const response = this._authService.verifyEmail(token);
    response.subscribe({
      next: result => {
        this.success = true;
      },
      error: error => {
        console.error('Email verification failed:', error);
        this.failure = true;
      }
    })
  }

}
