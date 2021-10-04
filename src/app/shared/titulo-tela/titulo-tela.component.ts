import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-titulo-tela',
  templateUrl: './titulo-tela.component.html',
  styleUrls: ['./titulo-tela.component.css']
})
export class TituloTelaComponent implements OnInit {

  @Input() titulo: string;
  @Input() subTitulo: string;
  constructor() { }

  ngOnInit() {
  }

}
