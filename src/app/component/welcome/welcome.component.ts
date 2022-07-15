import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  public user: string | any = ''
  constructor() { }

  ngOnInit(): void {
   this.user = localStorage.getItem('user') ?? this.saveUser()
  }

  public saveUser(): void {
    this.user = prompt("¿Cómo te llamas?");
    localStorage.setItem('user', this.user);
  }

}
