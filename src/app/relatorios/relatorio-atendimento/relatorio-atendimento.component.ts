import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js'
import { PesquisaModel } from './relatorio-atendimento.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { AtendimentoService } from './relatorio-atendimento.service';
import * as moment from 'moment';

@Component({
  selector: 'app-relatorio-atendimento',
  templateUrl: './relatorio-atendimento.component.html',
  styleUrls: ['./relatorio-atendimento.component.css']
})
export class RelatorioAtendimentoComponent implements OnInit {
 
  pesquisa = new PesquisaModel();
  
  constructor(public util: UtilsService, public service: AtendimentoService) { }


  public labelsProcedimentos: string[] = [];
  public labelsAtendimentos: string[] = [];
  public labelsSalas: string[] = [];

  public dataSalas: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"}
  ];
  public dataProcedimentos: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"}
  ];
  public dataAtendimentos: ChartDataset[] = [
    {data: [], label: '', backgroundColor: "green"}
  ];

  ngOnInit(){
    this.util.buscarUrl().subscribe(res => {
      this.pesquisa.dataInicial = moment().startOf('month').format('DD/MM/YYYY');
      this.pesquisa.dataFinal = moment().endOf('month').format('DD/MM/YYYY');
      this.carregarDadosRelatorioSalas(this.pesquisa.dataInicial, this.pesquisa.dataFinal);    
      this.carregarDadosRelatorioProcedimento(this.pesquisa.dataInicial, this.pesquisa.dataFinal);  
      this.carregarDadosRelatorioAtendimento(this.pesquisa.dataInicial, this.pesquisa.dataFinal);  
    });
  }

  carregarDadosRelatorioSalas(dataInicial, dataFinal) {
    this.service.listarDadosrelatorioSalas(dataInicial, dataFinal).subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataSalas = [{data: retorno.quantidade, label: 'Relatorio de Reserva de Salas', backgroundColor: "#8FCD75", borderColor: 'black', hoverBackgroundColor: '#CDEACD'}];
      this.labelsSalas = retorno.descricao;
    });
  }

  carregarDadosRelatorioProcedimento(dataInicial, dataFinal) {
    this.service.listarDadosrelatorioProcedimento(dataInicial, dataFinal).subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataProcedimentos = [{data: retorno.quantidade, label: 'Relatorio de Procedimentos', backgroundColor: "#90e76c", borderColor: 'black', hoverBackgroundColor: '#CDEACD'}];
      this.labelsProcedimentos = retorno.descricao;
    });
  }

  carregarDadosRelatorioAtendimento(dataInicial, dataFinal) {
    this.service.listarDadosrelatorioAtendimento(dataInicial, dataFinal).subscribe(res => {
      let retorno: any;
      retorno = res;
      this.dataAtendimentos = [{data: retorno.quantidade, label: 'Relatorio de Atendimentos', backgroundColor: "#6aa84f", borderColor: 'black', hoverBackgroundColor: '#CDEACD'}];
      this.labelsAtendimentos = retorno.descricao;
    });
  }

  btnPesquisar(){
    this.carregarDadosRelatorioSalas(this.pesquisa.dataInicial, this.pesquisa.dataFinal);    
    this.carregarDadosRelatorioProcedimento(this.pesquisa.dataInicial, this.pesquisa.dataFinal);      
    this.carregarDadosRelatorioAtendimento(this.pesquisa.dataInicial, this.pesquisa.dataFinal); 
  }

  public options: ChartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
}
