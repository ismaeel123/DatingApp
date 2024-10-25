import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../_Services/accounts.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule,BsDropdownModule,RouterLink,RouterLinkActive,TitleCasePipe],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
   accountService = inject (AccountsService)
   model:any = {}
   private router = inject(Router)
   private toaster = inject(ToastrService)

   login (){
    this.accountService.login(this.model).subscribe({
      next:_ =>this.router.navigateByUrl('/members'),
      error: error => this.toaster.error(error.error)
    })
   }

   logout()
   {
      this.accountService.logout()
      this.router.navigateByUrl('/')
   }
}
