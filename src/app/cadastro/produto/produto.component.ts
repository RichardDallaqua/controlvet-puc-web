import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Message, ConfirmationService } from 'primeng/api';
import { tipoMensagem } from 'src/app/common/enum/tipo-mensagem';
import { PesquisaModel } from 'src/app/common/model/pesquisa.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { ProdutoModel } from './produto.model';
import { ProdutoService } from './produto.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {

  msgs: Message[] = [];
  titulo: string;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  exibirCarregando: any = false;
  colunas: any[];
  produto = new ProdutoModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];

  constructor(private titleService: Title,
    private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: ProdutoService,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('usuario-acessaProduto') == '0') {
      this.router.navigated = true;
      window.location.href = "/acesso-indisponivel";
      this.router.navigate(["/acesso-indisponivel"]);
    }
    this.util.buscarUrl().subscribe(res => {
      this.carregarGridDados();
    });

    this.titleService.setTitle('ControlVet - Produto');
    this.titulo = "Pesquisar";
    this.colunas = [
      { field: 'id', header: 'ID', width: "10%" },
      { field: 'descricao', header: 'Descrição', width: "50%" },
      { field: 'valor', header: 'Valor', width: "20%" },
      { field: 'dataCadastro', header: 'Data Cadastro', width: "40%" },
    ];
  }

  btnPesquisar() {
    this.exibirCarregando = true;
    this.carregarGridDados();
    this.exibirCarregando = false;
  }

  btnSalvarDados() {
    if (this.validacaoDadosProduto()) {
      this.salvarProduto();
    }
  }

  salvarProduto() {
    this.exibirCarregando = true;

    this.service.salvarDados(this.produto).subscribe(res => {
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

  validacaoDadosProduto() {
    let status = true;
    if (!this.validacao.obrigatorio(["descricaoProduto", "valorProduto"])) {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Preencha os campos obrigatórios.");
      status = false;
    }
    return status;
  }

  btnNovoDados() {
    this.titulo = "Cadastro";
    this.produto = new ProdutoModel();
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.validacao.limpaMesangem("msg");
    this.util.focusComponent("descricaoProduto");
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.titulo = "Pesquisar";
    this.limparDadosEdicao();
    this.carregarGridDados();
  }

  limparDadosEdicao() {
    this.produto = new ProdutoModel();
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;

      this.titulo = "Editar";

      this.produto.id = registro.id;
      this.produto.descricao = registro.descricao;
      this.produto.valor = registro.valor;

      this.exibirEdicao = true;
      this.exibirConsulta = false;
      this.exibirCarregando = false;
    } else {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', 'Não é possível alterar um registro desativado.');
    }
  }

  btnAtivarRemoverDados(gridVo) {
    this.exibirCarregando = false;
    let ativarRemover = this.util.isNullEmptyUndefined(gridVo.dataDesativacao) ? "desativar" : "ativar";
    this.confirmationService.confirm({
      message: 'Deseja realmente ' + ativarRemover + ' esse registro?',
      header: 'Confirmação',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.ativarRemoverDados(gridVo);
      },
      reject: () => {
      }
    });
  }

  ativarRemoverDados(gridVo) {
    let ativarRemover = this.util.isNullEmptyUndefined(gridVo.dataDesativacao) ? "desativado" : "ativado";
    this.service.ativarRemoverDados(gridVo.id).subscribe(res => {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Sucesso", "Registro " + ativarRemover + " com sucesso!");
      this.carregarGridDados()
    }, err => {
      this.exibirCarregando = false;
      switch (err.status) {
        case 409:
          let msg = err.error.split(':')[1];
          this.msgs = [];
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", msg);
          break;
        default:
          this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      }
    });
  }

  carregarGridDados() {
    this.exibirCarregando = true;
    this.service.listarDadosProduto(this.pesquisa.nomeFiltro, this.pesquisa.exibeInativosFiltro).subscribe(res => {

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

    this.service.imprimirRelatorio(this.pesquisa.nomeFiltro, this.pesquisa.exibeInativosFiltro).subscribe(res => {
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
}
