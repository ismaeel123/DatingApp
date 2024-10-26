import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  baseURL = 'https://localhost:5001/api/'
  private httpClient = inject (HttpClient)
  validationErrors :string[] =[]

  get400Error(){
    this.httpClient.get(this.baseURL+"buggy/bad-request").subscribe({
      next:response=> console.log(response),
      error:error=> console.log(error)
    });
  }

  get401Error(){
    this.httpClient.get(this.baseURL+"buggy/auth").subscribe({
      next:response=> console.log(response),
      error:error=> console.log(error)
    });
  }

  get404Error(){
    this.httpClient.get(this.baseURL+"buggy/not-found").subscribe({
      next:response=> console.log(response),
      error:error=> console.log(error)
    });
  } 

  get500Error(){
    this.httpClient.get(this.baseURL+"buggy/server-error").subscribe({
      next:response=> console.log(response),
      error:error=> console.log(error)
    });
  }

  get400ValidationError(){
    this.httpClient.post(this.baseURL+"account/register",{}).subscribe({
      next:response=> console.log(response),
      error:error=> {
        console.log(error)
        this.validationErrors=error
      }
    });
  }
  
}
