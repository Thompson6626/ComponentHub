import {Component, input} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-auth-wrapper',
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  templateUrl: './auth-wrapper.component.html',
  styleUrl: './auth-wrapper.component.sass'
})
export class AuthWrapperComponent {

  title = input('Title');
}
