import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    registerMode = false;
    users:any;
    http = inject(HttpClient);


    toggleRegister ()
    {
      this.registerMode = !this.registerMode;
    }

  getUsers ()
  {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: repsonse => this.users= repsonse,
      error: err => console.log(err),
      complete: () => console.log('request has completed')
    });
  }

  ngOnInit(): void {
      this.getUsers()
  }

  cancelResigerMode(event: boolean) {
      this.registerMode=false;
    }
}
