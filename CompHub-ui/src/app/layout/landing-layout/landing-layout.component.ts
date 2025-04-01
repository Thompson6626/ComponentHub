import { Component } from '@angular/core';
import {AppFooterComponent} from '../app-footer/app-footer.component';
import {AppHeaderComponent} from '../app-header/app-header.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-landing-layout',
  imports: [
    AppFooterComponent,
    AppHeaderComponent,
    RouterOutlet
  ],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.sass'
})
export class LandingLayoutComponent {

}
