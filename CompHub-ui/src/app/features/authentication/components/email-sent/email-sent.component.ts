import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Button} from 'primeng/button';



@Component({
  selector: 'app-email-sent',
  imports: [
    RouterLink,
    Button
  ],
  templateUrl: './email-sent.component.html',
  styleUrl: './email-sent.component.sass'
})
export class EmailSentComponent {


}
