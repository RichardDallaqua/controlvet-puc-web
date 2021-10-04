import { Component, OnInit, Input } from '@angular/core';
import { Erro } from '../../common/model/erro-model';

@Component({
  selector: 'app-componente-basico',
  templateUrl: './componente-basico.component.html',
  styleUrls: ['./componente-basico.component.css']
})
export class ComponenteBasicoComponent implements OnInit {

  @Input() msg = [];
  @Input() exibirCarregando: boolean;
  @Input() descricao: string;
  @Input() confirmDialog: boolean;
  
  constructor() { }

  ngOnInit() {
  
  }

}
