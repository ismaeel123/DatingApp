import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { AccountsService } from './_Services/accounts.service';
import { HomeComponent } from "./home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, HomeComponent,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  private accountService = inject(AccountsService);

  ngOnInit(): void {
   this.setCurrentUser()   
  }

  setCurrentUser ()
  {
    const userString = localStorage.getItem('user')
    if (!userString) return

    const user =JSON.parse(userString)
    this.accountService.CurrentUser.set(user)
  }

  
  


}
