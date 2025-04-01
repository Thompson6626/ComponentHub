import { Component } from '@angular/core';
import {AppHeaderComponent} from '../../layout/app-header/app-header.component';

@Component({
  selector: 'app-landing-layout',
  imports: [
    AppHeaderComponent
  ],
  templateUrl: './landing-layout.component.html',
  styleUrl: './landing-layout.component.sass'
})
export class LandingLayoutComponent {

}
