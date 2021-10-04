import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../login/login.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  usuario: any = "";
  exibirCarregando = false;
  exibirbtnExpandir = true;
  exibirbtnEsconder = false;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.usuario = this.loginService.nomeUsuario();
  }

  sairButtonClick(){
    this.exibirCarregando = true;;
    this.loginService.finalizarSessao();
    this.loginService.sessaoLogada();
  }


  btnExpandir(){
    $(".main-panel").css("width", "calc(100%  - 260px)");
    $(".sidebar").css("left", "0px");
    this.exibirbtnEsconder = true;
    this.exibirbtnExpandir = false;
  }

  btnEsconder(){
    $(".main-panel").css("width", "calc(100% - 0px)");
    $(".sidebar").css("left", "-260px");
    this.exibirbtnEsconder = false;
    this.exibirbtnExpandir = true;
  }
}
