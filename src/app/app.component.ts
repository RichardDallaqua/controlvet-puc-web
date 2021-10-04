import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ControlVet';
  usuarioLogado: any = true;
  usuario: any = "";
 
  constructor() {
    this.usuario = localStorage.getItem('usuario-login')
    this.usuarioLogado = (this.usuario != undefined && this.usuario != null) ? true : false;
    this.usuario = (this.usuario != undefined && this.usuario != null) ? localStorage.getItem('usuario-sistema') : "";    
    localStorage.removeItem('usuario-login');
    localStorage.removeItem('usuario-sistema');
  }


}
