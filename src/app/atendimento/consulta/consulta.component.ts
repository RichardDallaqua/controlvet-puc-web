import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Message, SelectItem, ConfirmationService } from 'primeng/api';
import { ProdutoService } from 'src/app/cadastro/produto/produto.service';
import { tipoMensagem } from 'src/app/common/enum/tipo-mensagem';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { AgendamentoModel, PesquisaModel } from '../agendamento/agendamento.model';
import { AgendamentoService } from '../agendamento/agendamento.service';
import { ConsultaModel } from './consulta.model'
import { ConsultaService } from './consulta.service'
import { ItensConsultaModel } from './itensconsulta.model'

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  msgs: Message[] = [];
  titulo: string;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  isInsercao: any = false; 
  exibirCarregando: any = false;
  exibirGridItens : any = false; 
  isEdicaoItem: boolean = false;
  isLeitura: boolean = false;
  colunas: any[];
  colunasItens: any[];
  consulta = new ConsultaModel();
  itensConsulta = new ItensConsultaModel();
  agendamento = new AgendamentoModel();
  pesquisa = new PesquisaModel();
  produtos: SelectItem[] = [];
  produtoSelecionado: number;
  gridVo: any[];
  itensGridVo: any[];
  idItem = 0;

  constructor(private titleService: Title,
    private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: ConsultaService,
    private produtoService: ProdutoService,
    private agendamentoService: AgendamentoService,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('usuario-acessaConsulta') == '0') {
      this.router.navigated = true;
      window.location.href = "/acesso-indisponivel";
      this.router.navigate(["/acesso-indisponivel"]);
    }
    this.util.buscarUrl().subscribe(res => {
      this.carregarGridDados();
      this.carregarComboProdutos();
    });

    this.titleService.setTitle('ControlVet - Consulta');
    this.titulo = "Pesquisar";
    this.colunas = [
      { field: 'nomeTutor', header: 'Tutor', width: "30%" },
      { field: 'nomeAnimal', header: 'Animal', width: "25%" },
      { field: 'descricaoProcedimento', header: 'Procedimento', width: "10%" },
      { field: 'observacao', header: 'Observação', width: "35%" }
    ];
    this.colunasItens = [
      { field: 'idProduto', header: 'ID', width: "10%" },
      { field: 'descricaoProduto', header: 'Descrição', width: "40%" },      
      { field: 'quantidade', header: 'Quantidade', width: "20%" },
      { field: 'valorUnitario', header: 'Valor Unitário', width: "20%" },
      { field: 'valorFinal', header: 'Total', width: "20%" }
    ];
  }

  btnPesquisar() {
    this.exibirCarregando = true;
    this.carregarGridDados();
    this.exibirCarregando = false;
  }


  btnSalvarDados() {
    if (this.validacaoDadosConsulta()) {
      this.salvarConsulta();
    }
  }

  salvarConsulta() {

    this.exibirCarregando = true;
    this.consulta.valorTotal = this.util.formatarDecimalParaCalculo(this.consulta.valorTotal);  
    this.consulta.itensConsultaDto = this.itensGridVo;
    this.consulta.itensConsultaDto.forEach(element => {  
      element.valorTotal =  this.util.formatarDecimalParaCalculo(element.valorTotal);
      element.valorUnitario =  this.util.formatarDecimalParaCalculo(element.valorUnitario);
    });  
    this.service.salvarDados(this.consulta).subscribe(res => {
      let retorno: any;
      retorno = res;
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Sucesso", "Registros salvo com sucesso.");
      this.exibirCarregando = false;
      this.btnVoltarTelaPrincipal();
    }, err => {
      this.exibirCarregando = false;
      switch (err.status) {
        case 409:
          this.msgs = [];
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', err.error);
          break;
        default:
          this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      }
    });
  }

  validacaoDadosConsulta() {
    let status = true;
    if (!this.validacao.obrigatorio(["descricaoConsulta", "duracaoConsulta"])) {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Preencha os campos obrigatórios.");
      status = false;
    }
    return status;
  }

  btnNovoDados() {
    this.limparDados();
    this.titulo = "Cadastro";
    this.consulta = new ConsultaModel();
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.isInsercao = true;
    this.validacao.limpaMesangem("msg");
    this.util.focusComponent("descricaoConsulta");
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.titulo = "Pesquisar";
    this.limparDados();
    this.carregarGridDados();
  }

  limparDados() {
    this.consulta = new ConsultaModel();
  }

  btnAlterarDados(registro) {
    this.exibirCarregando = true;
    this.exibirEdicao = true;  
    this.exibirGridItens = true; 
    this.exibirConsulta = false; 
    this.isLeitura = false;
    this.titulo = "Editar";
    this.agendamento.nomeTutor = registro.nomeTutor;
    this.agendamento.nomeAnimal = registro.nomeAnimal;
    if (registro.atendido == "1") {
      this.service.carregarConsulta(registro.id).subscribe(res => {
        let retorno: any;
        retorno = res;

        this.isLeitura = true;  
        this.consulta.idAgendamento = registro.id;
        this.consulta.anamnese = res.anamnese;
        this.consulta.id = res.id;
        this.consulta.prescricao = res.prescricao;
        this.consulta.tratamento = res.tratamento;
        this.consulta.valorTotal = res.valorTotal;
        this.itensGridVo = res.itemConsultaVo;
        this.exibirCarregando = false;
      }, err => {
        this.exibirCarregando = false;
        this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      });
    } else {  
      this.consulta = new ConsultaModel();
      this.consulta.idAgendamento = registro.id;
      this.itensConsulta = new ItensConsultaModel();
      this.itensGridVo = [];
      this.exibirCarregando = false;
    }
  }
  

  btnExcluir(gridVo) {
    this.exibirCarregando = false;
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir a consulta de ' + gridVo.nomeTutor + '?',
      header: 'Confirmação',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.RemoverDados(gridVo);
      },
      reject: () => {
      }
    });
  }

  RemoverDados(gridVo) {
    this.service.RemoverDados(gridVo.id).subscribe(res => {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Sucesso", "Registro removido com sucesso!");
      this.carregarGridDados()
    }, err => {
      this.exibirCarregando = false;
      switch (err.status) {
        case 409:
          let msg = err.error.split(':')[1];
          this.msgs = [];
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", msg);
          break;
        case 404:
          let msg404 = 'Arquivo não foi removido pois não consta no banco de dados.';
          this.msgs = [];
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", msg404);
          break;  
        default:
          this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      }
    });
  }

  carregarGridDados() {
    this.exibirCarregando = true;
    if (this.pesquisa.dataAgendamento == undefined) {
      this.pesquisa.dataAgendamento = '';
    }
    this.agendamentoService.listarDadosAgendamento(this.pesquisa.dataAgendamento).subscribe(res => {

      let retorno: any;
      retorno = res;
      this.gridVo = retorno;
      this.exibirCarregando = false;
    }, err => {
      this.exibirCarregando = false;
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  btnGridCSV() {
    this.exibirCarregando = true;

    this.service.imprimirRelatorio(this.pesquisa.dataAgendamento).subscribe(res => {
      if (res != null) {
        let retorno: any = res;
        var sampleArr = this.util.base64ToArrayBuffer(retorno.arquivo);
        this.util.saveByteArray(retorno.nomeArquivo, sampleArr);
      }
      this.exibirCarregando = false;
    }, err => {
      this.msgs = [];
      this.exibirCarregando = false;
      switch (err.status) {
        case 409:          
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', err.error);
          break;
        default:
          this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      }
      
    });
  }

// <============= Funções Itens ==================>

  btnAdicionarItem(){
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.exibirGridItens = false;
    this.adicionarItem();
  }

  adicionarItem() {
    this.isEdicaoItem = false;
    let retorno = this.itensGridVo;   
    if (this.consulta.idMaxItem == undefined) {
      this.consulta.idMaxItem = 1
    } else {
      this.consulta.idMaxItem = this.consulta.idMaxItem + 1;
    }
    this.idItem = this.consulta.idMaxItem;
    this.itensConsulta.id = this.idItem;
    this.itensConsulta.quantidade = "1";

    if (retorno == undefined) {
      retorno = [];
    }

    retorno.push(
      {
        id: this.idItem,
        descricaoProduto: this.itensConsulta.descricaoProduto,
        idProduto: this.itensConsulta.idProduto,
        valorUnitario: this.itensConsulta.valorUnitario,
        quantidade: this.itensConsulta.quantidade,
        valorTotal: this.itensConsulta.valorTotal,
      }
    );

    this.itensGridVo = retorno;
  }

  carregarComboProdutos(){
    this.produtoService.listarDadosProduto("", "False").subscribe(res => {
      let retorno: any;
      retorno = res;
      for (let item of retorno) {
        this.produtos.push({ label: (item.id + " - " + item.descricao), value: item.id });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  };

  carregarValorUnitario(){
    if (this.produtoSelecionado !== undefined && this.produtoSelecionado !== 0) {
      this.produtoService.buscaProdutoPorId(this.produtoSelecionado).subscribe(res => {
        let retorno: any;
        retorno = res;

        this.itensConsulta.valorUnitario = this.util.stringReplace(this.util.fortmataMoedaFloatParaString(retorno.valor), ".", ",");
        this.itensConsulta.descricaoProduto = retorno.descricao;
        this.itensConsulta.idProduto = retorno.id;
        this.recalcularTotalItem();
      }, err => {
        this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      });      
    }  
  }

  recalcularTotalItem(){
    var valorUnitario = this.util.formatarDecimalParaCalculo(this.itensConsulta.valorUnitario);
    var quantidade = this.util.formatarDecimalParaCalculo(this.itensConsulta.quantidade);
    var resultado = valorUnitario * quantidade;
    this.itensConsulta.valorTotal = this.util.stringReplace(this.util.fortmataMoedaFloatParaString(resultado.toFixed(2)), ".", ","); 
  };

  recalcularTotalConsulta(){
    var resultado = 0;
    this.itensGridVo.forEach(element => {  
      resultado = resultado + this.util.formatarDecimalParaCalculo(element.valorTotal);
    });  
    this.consulta.valorTotal = this.util.stringReplace(this.util.fortmataMoedaFloatParaString(resultado.toFixed(2)), ".", ",");
  };

  btnSalvarDadosItem(){
    if (this.validacaoDadosItem()) {
      this.salvarDadosItem()
    }    
  }

  validacaoDadosItem(){
    return true;
  }

  salvarDadosItem(){
    this.exibirCarregando = true;
    let index = this.itensGridVo.findIndex(x => x['id'] === this.idItem);
    this.itensGridVo[index].descricaoProduto = this.itensConsulta.descricaoProduto;
    this.itensGridVo[index].idProduto = this.itensConsulta.idProduto;
    this.itensGridVo[index].valorUnitario = this.itensConsulta.valorUnitario;
    this.itensGridVo[index].quantidade = this.itensConsulta.quantidade;
    this.itensGridVo[index].valorTotal = this.itensConsulta.valorTotal;
    
    this.exibirGridItens = true;
    this.exibirCarregando = false;
    this.recalcularTotalConsulta();
    this.limparCamposItem();
  }

  limparCamposItem(){
    this.itensConsulta = new ItensConsultaModel();
    this.produtoSelecionado = 0;
  }

  btnVoltarItem() {
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.exibirGridItens = true;
    this.itensConsulta = new ItensConsultaModel();
    if (!this.isEdicaoItem) {
      this.btnRemoverItem(this.idItem);
    }
  }

  btnRemoverItem(registro){
    let index = null;
    index = this.itensGridVo.findIndex(x => x['id'] === registro.id);
    this.itensGridVo.splice(index, 1);    
  }


  btnAlterarDadosItem(registro) {
    this.exibirGridItens = false;
    this.isEdicaoItem = true;
    this.idItem = registro.id;

    let index = null;
    index = this.itensGridVo.findIndex(x => x['id'] === this.idItem);
    let retorno = this.itensGridVo[index];

    this.produtoSelecionado = retorno.idProduto;
    this.itensConsulta.descricaoProduto = retorno.descricaoProduto;
    this.itensConsulta.idProduto = retorno.idProduto;
    this.itensConsulta.valorUnitario = retorno.valorUnitario;
    this.itensConsulta.quantidade = retorno.quantidade;
    this.itensConsulta.valorTotal = retorno.valorTotal;
  }
}
