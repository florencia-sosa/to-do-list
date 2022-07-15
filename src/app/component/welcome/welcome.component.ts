import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  public user: string | any = 'usuario'
  constructor() { }

  ngOnInit(): void {
    this.user = localStorage.getItem('user') ?? this.newUser()
  }

  public newUser() {
    this.user = prompt("¿Cómo te llamas?");
    if (this.user === '') {
      this.user = 'usuario'
    }
    localStorage.setItem('user', this.user);
    return this.user
  }

}
