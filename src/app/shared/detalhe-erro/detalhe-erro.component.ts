import { Component, OnInit, Input, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core'; 
import { UtilsService } from '../../common/utils/utils.service';
 

@Component({
  selector: 'app-detalhe-erro',
   templateUrl: './detalhe-erro.component.html', 
  styleUrls: ['./detalhe-erro.component.css']
})
export class DetalheErroComponent implements OnInit  {

  @Input() descricao: string;
  @Input() log: string;
 
 
  constructor(private util: UtilsService  ) { }

  ngOnInit() { 
  } 
}
