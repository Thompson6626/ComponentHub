import {Component, input} from '@angular/core';
import {DatePipe} from "@angular/common";
import {ComponentShowcase} from '../../../models/component/component-showcase';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-component-card',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './component-card.component.html',
  styleUrl: './component-card.component.sass'
})
export class ComponentCardComponent {

  component = input.required<ComponentShowcase>();
}
