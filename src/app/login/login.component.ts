import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from './login.model';
import { Message, MessageService } from 'primeng/api';
import { Erro } from '../common/model/erro-model';
import { tipoMensagem } from '../common/enum/tipo-mensagem';
import { Md5 } from 'ts-md5/dist/md5';
import { LoginService } from './login.service';
import { ValidacaoService } from '../common/validacao/validacao.service';
import { UtilsService } from '../common/utils/utils.service';
import * as $ from 'jquery'
import { UsuarioService } from '../cadastro/usuario/usuario.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  public gapiSetup: boolean = false; 
  public authInstance: gapi.auth2.GoogleAuth;
  public error: string;
  public user: gapi.auth2.GoogleUser;

  detalheErro: boolean = false;
  erro = new Erro();
  login = new LoginModel();
  exibirLogin: any = false;
  exibirAlteraSenha: any = false;
  exibirCarregando: boolean = false;
  msgs: Message[] = [];
  autenticacao: any = {
    usuario: "",
    senha: "",
    novaSenha: "",
    confirmaSenha: ""
  };

  constructor(private router: Router,
    private titleService: Title,
    private http: HttpClient,
    private loginService: LoginService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private messageService: MessageService) {

    localStorage.setItem('cd-erro', null);
      this.util.buscarUrl().subscribe(res => {
        this.titleService.setTitle('ControlVet - Entrar');
  
        if (this.loginService.sessaoLogada()) {
            this.exibirLogin = false;
            this.router.navigated = true;
            this.router.navigate(["/agendamento"]);          
        } else {
          this.exibirLogin = true;
          setTimeout(function () { $(`#usuario`).focus(); }, 100);
        }
    });
  }

  async ngOnInit() {
    if (await this.checkIfUserAuthenticated()) {
      this.user = this.authInstance.currentUser.get();
    }
  }

  btnLogar(viaGoogle) {    
    this.exibirCarregando = true;

    let isGoogle = (viaGoogle && this.user != undefined && this.user != null) ? 'true' : 'false'; 
    let nome = isGoogle == 'true' ? this.user.getBasicProfile().getName() : ((this.login.nome == undefined || this.login.nome == null) ? '' : this.login.nome);
    let login = isGoogle == 'true' ? this.user.getBasicProfile().getEmail() : this.login.login;
    let senha = isGoogle == 'true' ? this.user.getBasicProfile().getId() : this.login.senha;
    
    if (this.validacaoLogin(login, senha)) {
      this.loginService.autententicar(login, senha, nome, isGoogle).subscribe(
        res => {
          this.loginService.defineLocalStorare(res);
          
          let retorno: any;
          retorno = res;
          if (retorno.login != null && retorno.login != "") {
            this.router.navigated = true;
            window.location.href = "/agendamento";
            this.router.navigate(["/agendamento"]);
          }    
          this.exibirCarregando = false;
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
    }else{
      this.exibirCarregando = false;
    }
  }

  validacaoLogin(login, senha) {
    //Valida campos obrigatorios.
    if (this.util.isNullEmptyUndefined(login)) {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Preencha o login para continuar.");
      return false
    }

    if (this.util.isNullEmptyUndefined(senha) ) {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Preencha a senha para continuar.");
      return false
    }
    return true;
  }

  // ============= Validação GOOGLE ==============
  async initGoogleAuth(): Promise<void> {
    const pload = new Promise((resolve) => {
      gapi.load('auth2', resolve);
    });

    return pload.then(async () => {
      await gapi.auth2
        .init({ client_id: '697851673407-7k7ppstsb13rts5fa5ps554gkkp5j16b.apps.googleusercontent.com' })
        .then(auth => {
          this.gapiSetup = true;
          this.authInstance = auth;
        });
    });
  }

  async authenticate(): Promise<gapi.auth2.GoogleUser> {
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }

    return new Promise(async () => {
      await this.authInstance.signIn().then(
        user => this.user = user,
        error => this.error = error);
        this.btnLogar(true);
    });
  }

  async checkIfUserAuthenticated(): Promise<boolean> {
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }

    return this.authInstance.isSignedIn.get();
  }

}
