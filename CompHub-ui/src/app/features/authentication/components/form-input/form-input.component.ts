import {Component, input} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {TitleCasePipe} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {ReactiveFormsModule} from '@angular/forms';
import {Password} from 'primeng/password';

@Component({
  selector: 'app-form-input',
  imports: [
    FloatLabel,
    TitleCasePipe,
    InputText,
    ReactiveFormsModule,
    Password
  ],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.sass'
})
export class FormInputComponent {

  variant = input<'in'|'on'|'over'>('in');

  isPassword = input(false);

  name = input.required<string>();

  checkErrors = input<() => string | null>();





}
