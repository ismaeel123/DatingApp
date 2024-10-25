import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../_Models/User';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private http = inject(HttpClient)
  baseURL ='https://localhost:5001/api/'
  CurrentUser = signal <User | null> (null)

  login (model:any)
  {
    return this.http.post<User>(this.baseURL+"Account/login",model).pipe(
      map(user =>{
        if (user)
        {
          localStorage.setItem('user',JSON.stringify(user))
          this.CurrentUser.set(user)
        }
      })
    )
  }

  register (model:any)
  {
    return this.http.post<User>(this.baseURL+"Account/register",model).pipe(
      map(user =>{
        if (user)
        {
          localStorage.setItem('user',JSON.stringify(user))
          this.CurrentUser.set(user)
        }
        return user;
      })
    )
  }

  logout ()
  {
    localStorage.removeItem('user')
    this.CurrentUser.set(null)
  }
  
}
