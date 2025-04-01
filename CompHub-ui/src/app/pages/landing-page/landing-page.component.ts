import { Component } from '@angular/core';
import {LandingLayoutComponent} from '../landing-layout/landing-layout.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [
    LandingLayoutComponent,
    RouterLink
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.sass'
})
export class LandingPageComponent {

}
