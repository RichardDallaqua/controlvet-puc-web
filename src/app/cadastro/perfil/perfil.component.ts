import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { tipoMensagem } from 'src/app/common/enum/tipo-mensagem';
import { Erro } from 'src/app/common/model/erro-model';
import { PesquisaModel } from 'src/app/common/model/pesquisa.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { LoginService } from 'src/app/login/login.service';
import { PerfilModel } from './perfil.model';
import { PerfilService } from './perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  msgs: Message[] = [];
  titulo: string;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  exibirCarregando: any = false;
  colunas: any[];
  perfil = new PerfilModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];

  constructor(private titleService: Title,
    private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: PerfilService,
    private router: Router,
    private loginService: LoginService) {
  }

  ngOnInit() {
    if (localStorage.getItem('usuario-acessaPerfil') == '0') {
      this.router.navigated = true;
      window.location.href = "/acesso-bloqueado";
      this.router.navigate(["/acesso-bloqueado"]);
    }
    this.util.buscarUrl().subscribe(res => {
      this.carregarGridDados();
    });

    this.titleService.setTitle('ControlVet - Perfil');
    this.titulo = "Pesquisar";
    this.colunas = [
      { field: 'id', header: 'ID', width: "10%" },
      { field: 'descricao', header: 'Descricao', width: "50%" },
      { field: 'dataCadastro', header: 'Data Cadastro', width: "40%" },
    ];
  }

  btnPesquisar() {
    this.exibirCarregando = true;
    this.carregarGridDados();
    this.exibirCarregando = false;
  }

  btnSalvarDados() {
    if (this.validacaoDadosPerfil()) {
      this.salvarPerfil();
    }
  }

  deslogarUsuario(){
    this.exibirCarregando = true;;
    this.loginService.finalizarSessao();
    this.loginService.sessaoLogada();
  }

  salvarPerfil() {
    this.exibirCarregando = true;

    this.service.salvarDados(this.perfil).subscribe(res => {
      let retorno: any;
      retorno = res;
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Sucesso", "Registros salvo com sucesso.");
      this.exibirCarregando = false;

      if (localStorage.getItem('usuario-idPerfil') == retorno.id) {
        this.deslogarUsuario();
      }

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

  validacaoDadosPerfil() {
    let status = true;
    if (!this.validacao.obrigatorio(["descricaoPerfil"])) {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Preencha os campos obrigatórios.");
      status = false;
    }
    return status;
  }

  btnNovoDados() {
    this.titulo = "Cadastro";
    this.perfil = new PerfilModel();
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.validacao.limpaMesangem("msg");
    this.util.focusComponent("descricaoPerfil");
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.titulo = "Pesquisar";
    this.limparDadosEdicao();
    this.carregarGridDados();
  }

  limparDadosEdicao() {
    this.perfil = new PerfilModel();
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;
      
      this.titulo = "Editar";

      this.perfil.id = registro.id;
      this.perfil.descricao = registro.descricao;
      this.perfil.acessaAgenda = registro.acessaAgenda;
      this.perfil.acessaConsultas = registro.acessaConsultas;
      this.perfil.acessaPerfil = registro.acessaPerfil;
      this.perfil.acessaProcedimento = registro.acessaProcedimento;
      this.perfil.acessaSala = registro.acessaSala;
      this.perfil.acessaTutor = registro.acessaTutor;
      this.perfil.acessaUsuario = registro.acessaUsuario;
      this.perfil.acessaVeterinario = registro.acessaVeterinario;
      this.perfil.acessaProduto = registro.acessaProduto;

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
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Sucesso", "Registro " + ativarRemover + " com sucesso.");
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
    this.service.listarDadosPerfil(this.pesquisa.nomeFiltro, this.pesquisa.exibeInativosFiltro).subscribe(res => {
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
