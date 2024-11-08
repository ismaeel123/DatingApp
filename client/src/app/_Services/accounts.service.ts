import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../_Models/User';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AccountsService {
  private http = inject(HttpClient)
  baseURL = environment.apiUrl
  CurrentUser = signal <User | null> (null)

  login (model:any)
  {
    return this.http.post<User>(this.baseURL+"Account/login",model).pipe(
      map(user =>{
        if (user)
        {
          this.setCurrentUser(user)
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
          this.setCurrentUser(user)
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

  setCurrentUser (user: User)
  {
    localStorage.setItem('user',JSON.stringify(user))
    this.CurrentUser.set(user)
  }
  
}
