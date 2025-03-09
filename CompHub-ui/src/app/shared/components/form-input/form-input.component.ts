import {Component, forwardRef, input} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {TitleCasePipe} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import {Password} from 'primeng/password';
import {camelCaseToSeparated, capitalize} from '../../utils/string-utils';
import {CamelCaseToSeparetedPipe} from '../../pipes/camel-case-to-separeted.pipe';

@Component({
  selector: 'app-form-input',
  imports: [
    FloatLabel,
    TitleCasePipe,
    InputText,
    ReactiveFormsModule,
    Password,
    CamelCaseToSeparetedPipe
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.sass'
})
export class FormInputComponent{

  variant = input<'in'|'on'|'over'>('in');

  formControl = input.required<FormControl<string>>();
  controlName = input.required<string>();


  getFirstError(controlName: string): string | null{

    if (!this.formControl().errors || !this.formControl().touched) {
      return null;
    }

    if (this.formControl().hasError('required')) {
      return `${capitalize(camelCaseToSeparated(controlName))} is required.`;
    }

    if (this.formControl().hasError('email')) {
      return `Email must be valid`;
    }

    const errors = this.formControl().errors;
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        return camelCaseToSeparated(errors[key]);
      }
    }

    return null;
  }




}
