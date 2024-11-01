import { Component }from '@angular/core';
import { RegisterComponent } from "../register/register.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
    registerMode = false;
 
  toggleRegister ()
    {
      this.registerMode = !this.registerMode;
    }

  cancelResigerMode(event: boolean) {
      this.registerMode=false;
    }
}
