import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { PesquisaModel } from './relatorio-financeiro.model';
import { FinanceiroService } from './relatorio-financeiro.service';

@Component({
  selector: 'app-relatorio-financeiro',
  templateUrl: './relatorio-financeiro.component.html',
  styleUrls: ['./relatorio-financeiro.component.css']
})
export class RelatorioFinanceiroComponent implements OnInit {

  pesquisa = new PesquisaModel

  public data: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"}
  ];

  public labels: string[] = [];

  constructor(public util: UtilsService, public service: FinanceiroService) { }

  ngOnInit(){
    this.util.buscarUrl().subscribe(res => {
      this.pesquisa.dataInicial = moment().startOf('month').format('DD/MM/YYYY');
      this.pesquisa.dataFinal = moment().endOf('month').format('DD/MM/YYYY');
      this.carregarDadosRelatorio(this.pesquisa.dataInicial, this.pesquisa.dataFinal);      
    });
  }

  carregarDadosRelatorio(dataInicial, dataFinal) {
    this.service.listarDadosProdutosVendidos(dataInicial, dataFinal).subscribe(res => {
      let retorno: any;
      retorno = res;
      this.data = [{data: retorno.quantidadeVendida, label: 'Quantidade dos Produtos Vendidos', backgroundColor: "#6aa84f", borderColor: 'black', hoverBackgroundColor: '#CDEACD'},
                   {data: retorno.valorVendidos, label: 'Valor Faturado dos Produtos Vendidos', backgroundColor: "#90e76c", borderColor: 'black', hoverBackgroundColor: '#CDEACD'}];
      this.labels = retorno.descricao;
    });
  }

  btnPesquisar(){
    this.carregarDadosRelatorio(this.pesquisa.dataInicial, this.pesquisa.dataFinal);        
  }

  public options: ChartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
}
