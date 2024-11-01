import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountsService } from '../_Services/accounts.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountServices = inject(AccountsService)
  if (accountServices.CurrentUser())
  {
  req =req.clone({
    setHeaders: {
      Authorization : `Bearer ${accountServices.CurrentUser()?.token}`
    }
  })
} 
  return next(req);
};
