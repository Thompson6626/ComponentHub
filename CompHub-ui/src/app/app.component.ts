import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import Nora from '@primeng/themes/nora';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent{
  title = 'CompHub-ui';

  constructor(private primeng: PrimeNG) {
    this.primeng.ripple.set(true);
    this.primeng.theme.set({
      preset: Nora,
      options: {
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities'
        }
      }
    })
  }
}
