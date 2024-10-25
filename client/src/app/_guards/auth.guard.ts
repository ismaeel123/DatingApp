import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountsService } from '../_Services/accounts.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountServies =inject(AccountsService)
  const toastr = inject(ToastrService)

  if (accountServies.CurrentUser())
    return true
  else{
    toastr.error('you shall not pass')
    return false;
  }
};
