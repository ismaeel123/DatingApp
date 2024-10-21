import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  http = inject(HttpClient);
  title = 'Dating App';
  users:any;

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: repsonse => this.users= repsonse,
      error: err => console.log(err),
      complete: () => console.log('request has completed')
    });

  }
  


}
