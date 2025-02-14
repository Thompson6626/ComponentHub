import { Component } from '@angular/core';
import {AppHeaderComponent} from '../app-header/app-header.component';
import {RouterOutlet} from '@angular/router';
import {AppFooterComponent} from '../app-footer/app-footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    AppHeaderComponent,
    RouterOutlet,
    AppFooterComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.sass'
})
export class MainLayoutComponent {

}
