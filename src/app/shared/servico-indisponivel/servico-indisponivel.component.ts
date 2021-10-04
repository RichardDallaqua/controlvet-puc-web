import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servico-indisponivel',
  templateUrl: './servico-indisponivel.component.html',
  styleUrls: ['./servico-indisponivel.component.css']
})
export class ServicoIndisponivelComponent implements OnInit {

  constructor() { }
  
  
  ngOnInit() {
  }

  btnVoltar() {
    window.history.back();
  }
}
