import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  acessaUsuario: Boolean;
  acessaPerfil: Boolean;
  acessaConsultas: Boolean;
  acessaAgenda: Boolean;
  acessaSala: Boolean;
  acessaProcedimento: Boolean;
  acessaVeterinario: Boolean;
  acessaTutor: Boolean;
  acessaProduto: Boolean;

   constructor(private router:Router, private titleService: Title) { 
    this.acessaUsuario = localStorage.getItem('usuario-acessaUsuario') == '1';
    this.acessaPerfil = localStorage.getItem('usuario-acessaPerfil') == '1';
    this.acessaConsultas = localStorage.getItem('usuario-acessaConsultas') == '1';
    this.acessaAgenda = localStorage.getItem('usuario-acessaAgenda') == '1';
    this.acessaSala = localStorage.getItem('usuario-acessaSala') == '1';
    this.acessaProcedimento = localStorage.getItem('usuario-acessaProcedimento') == '1';
    this.acessaTutor = localStorage.getItem('usuario-acessaTutor') == '1';
    this.acessaProduto = localStorage.getItem('usuario-acessaProduto') == '1';
   }
 
  ngOnInit() {
    this.titleService.setTitle('ControlVet - Home');
    //Inicia com o menu escondido
    $(".main-panel").css("width", "calc(100% - 0px)");
    $(".sidebar").css("left", "-260px");
  }
}
