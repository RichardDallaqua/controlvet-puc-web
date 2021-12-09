import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, Message, SelectItem } from 'primeng/api';
import { PesquisaModel } from 'src/app/common/model/pesquisa.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { tipoMensagem } from '../../common/enum/tipo-mensagem';
import { Erro } from '../../common/model/erro-model';
import { ValidacaoService } from '../../common/validacao/validacao.service';
import { LoginService } from '../../login/login.service';
import { UsuarioModel } from './usuario.model';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})

export class UsuarioComponent implements OnInit {

  msgs: Message[] = [];
  titulo: string;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  exibirCarregando: any = false;
  colunas: any[];
  usuario = new UsuarioModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];
  perfil: SelectItem[] = [];
  perfisSelecionadas: number;

  constructor(private titleService: Title,
    private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: UsuarioService,
    private loginService: LoginService,
  ) {
  }

  ngOnInit() {
    this.util.buscarUrl().subscribe(res => {
      
      this.carregaComboPerfis();
      this.carregarGridDados();
    });

    this.colunas = [
      { field: 'id', header: 'ID', width: "5%" },
      { field: 'nome', header: 'Nome', width: "20%" },
      { field: 'login', header: 'Login', width: "20%" },
      { field: 'perfil', header: 'Perfil', width: "20%" },
      { field: 'dataCadastro', header: 'Data Cadastro', width: "20%" },
    ];

    this.titleService.setTitle('ControlVet - Usuário');
    this.titulo = "Pesquisar";
  }

  carregaComboPerfis() {
    this.service.listarPerfis().subscribe(res => {
      let retorno: any;
      retorno = res;
      for (let item of retorno) {
        this.perfil.push({ label: (item.descricao), value: item.id });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  btnPesquisar() {
    this.exibirCarregando = true;
    this.carregarGridDados();
    this.exibirCarregando = false;
  }

  btnSalvarDados() {
    this.salvarUsuario();
  }

  deslogarUsuario(){
    this.exibirCarregando = true;;
    this.loginService.finalizarSessao();
    this.loginService.sessaoLogada();   
  }

  salvarUsuario() {
    this.exibirCarregando = true;
    this.usuario.idPerfil = this.perfisSelecionadas;
    this.service.salvarDados(this.usuario).subscribe(res => {
      let retorno: any;
      retorno = res;
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Sucesso", "Registros salvo com sucesso!");
      this.exibirCarregando = false;

      if (localStorage.getItem('usuario-id') == retorno.id) {
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

  validacaoDadosUsuario() {
    let status = true;
    if (!this.validacao.obrigatorio(["nomeUsuario", "loginUsuario", "senha", "cbperfil"])) {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Preencha os campos obrigatórios.");
      status = false;
    }
    return status;
  }

  btnNovoDados() {
    this.titulo = "Cadastro";
    this.usuario = new UsuarioModel();
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.validacao.limpaMesangem("msg");
    this.validacao.limpaVariasMesangens(["cnpj"]);
    this.util.focusComponent("cnpj");
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.limparDadosEdicao();
    this.carregarGridDados();
  }

  limparDadosEdicao() {
    this.usuario = new UsuarioModel();
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;
      this.titulo = "Editar";
      this.usuario.id = registro.id;
      this.usuario.nome = registro.nome;
      this.usuario.login = registro.login;
      this.usuario.senha = registro.senha;
      this.usuario.idPerfil = registro.idPerfil;
      this.perfisSelecionadas = registro.idPerfil;

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
    this.service.listarDadosUsuario(this.pesquisa.nomeFiltro, this.pesquisa.exibeInativosFiltro).subscribe(res => {

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