import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'blog-app';
  selectedOption: string = '';
  public entries = [
    {
      name: 'Login',
      link: 'login'
    },
    {
      name: 'Register',
      link: 'register'
    }
  ]
  constructor(private router: Router) {
  }
  onSelect() {
    this.router.navigate([`${this.selectedOption}`])
    console.log(this.selectedOption)
  }
}
