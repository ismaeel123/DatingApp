import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../_Services/accounts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model:any ={}
  cancelRegister = output<boolean> ()
  private accountService =inject(AccountsService)
  private toaster= inject(ToastrService)

  register (){
    this.accountService.register(this.model).subscribe({
      next:response => {
        console.log (response)
        this.cancel()
      },
      error:error => this.toaster.error(error.error)    
    })
  }
  cancel (){
    this.cancelRegister.emit(false);
  }
}
