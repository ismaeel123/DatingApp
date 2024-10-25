import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../_Services/accounts.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule,BsDropdownModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
   accountService = inject (AccountsService)
   model:any = {}

   login (){
    this.accountService.login(this.model).subscribe({
      next:response =>{
        console.log(response)
      },
      error: error =>console.log(error)
    })
   }

   logout()
   {
      this.accountService.logout()
   }
}
