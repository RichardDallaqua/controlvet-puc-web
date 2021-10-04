import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-legenda',
  templateUrl: './legenda.component.html',
  styleUrls: ['./legenda.component.css']
})
export class LegendaComponent implements OnInit {
  @Input() registroAtivo: boolean;
  @Input() duploClick: boolean;  
  @Input() registroExcluido: boolean;
  @Input() registroInativo: boolean;
  constructor() { }

  ngOnInit() {
    
  }

}
