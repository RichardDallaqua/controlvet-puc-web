import { Component, OnInit, TestabilityRegistry } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfirmationService, Message, SelectItem } from 'primeng/api';
import { tipoMensagem } from 'src/app/common/enum/tipo-mensagem';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { AgendamentoModel, PesquisaModel } from './agendamento.model';
import { AgendamentoService } from './agendamento.service';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.css']
})
export class AgendamentoComponent implements OnInit {
  
  msgs: Message[] = [];
  titulo: string;
  exibirConsulta: any = true;
  exibirEdicao: any = false;
  isInsercao: any = false; 
  exibirCarregando: any = false;
  colunas: any[];
  agendamento = new AgendamentoModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];
  procedimentos: SelectItem[] = [];
  procedimentoSelecionado: number;
  salas: SelectItem[] = [];
  salaSelecionada: number;
  tutores: SelectItem[] = [];
  tutorSelecionado: number;
  animais: SelectItem[] = [];
  animalSelecionado: number;

  constructor(private titleService: Title,
    private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: AgendamentoService,
    private router: Router
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('usuario-acessaAgendamento') == '0') {
      this.router.navigated = true;
      window.location.href = "/acesso-indisponivel";
      this.router.navigate(["/acesso-indisponivel"]);
    }
    this.util.buscarUrl().subscribe(res => {
      this.carregarComboProcedimento();
      this.carregarComboSala();
      this.carregarComboTutores();
      this.carregarGridDados();
    });

    this.titleService.setTitle('ControlVet - Agendamento');
    this.titulo = "Pesquisar";
    this.colunas = [
      { field: 'horaAgendamento', header: 'Hoário', width: "10%" },
      { field: 'nomeTutor', header: 'Tutor', width: "20%" },
      { field: 'nomeAnimal', header: 'Animal', width: "20%" },
      { field: 'descricaoSala', header: 'Sala', width: "15%" },
      { field: 'descricaoProcedimento', header: 'Procedimento', width: "15%" },
      { field: 'observacao', header: 'Observação', width: "20%" },
    ];
  }

  btnPesquisar() {
    this.exibirCarregando = true;
    this.carregarGridDados();
    this.exibirCarregando = false;
  }

  carregarComboProcedimento() {
    this.service.listarProcedimentos().subscribe(res => {
      let retorno: any;
      retorno = res;
      for (let item of retorno) {
        this.procedimentos.push({ label: (item.descricao), value: item.id });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  carregarAnimaisTutor(){
    if (this.tutorSelecionado !== undefined) {
      this.animais = [];
      this.service.listarAnimais(this.tutorSelecionado).subscribe(res => {
        let retorno: any;
        retorno = res;
        for (let item of retorno) {
          this.animais.push({ label: (item.nome), value: item.id });
        }
      }, err => {
        this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      });
    }  
  }

  carregarComboSala() {
    this.service.listarSalas().subscribe(res => {
      let retorno: any;
      retorno = res;
      for (let item of retorno) {
        this.salas.push({ label: (item.descricao), value: item.id });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  carregarComboTutores() {
    this.service.listarTutores().subscribe(res => {
      let retorno: any;
      retorno = res;
      for (let item of retorno) {
        this.tutores.push({ label: (item.nome), value: item.id });
      }
    }, err => {
      this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
    });
  }

  btnSalvarDados() {
    this.salvarAgendamento();
  }

  salvarAgendamento() {
    this.exibirCarregando = true;

    this.agendamento.idTutor = this.tutorSelecionado;
    this.agendamento.idAnimal = this.animalSelecionado;
    this.agendamento.idProcedimento = this.procedimentoSelecionado;
    this.agendamento.idSala = this.salaSelecionada;
    this.agendamento.idUsuario = localStorage.getItem('usuario-id');

    this.service.salvarDados(this.agendamento).subscribe(res => {
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

  btnNovoDados() {
    this.limparDados();
    this.titulo = "Cadastro";
    this.agendamento = new AgendamentoModel();
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.isInsercao = true;
    this.validacao.limpaMesangem("msg");
    this.util.focusComponent("descricaoAgendamento");
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.titulo = "Pesquisar";
    this.limparDados();
    this.carregarGridDados();
  }

  limparDados() {
    this.agendamento = new AgendamentoModel();
    this.procedimentoSelecionado = 0;
    this.salaSelecionada = 0;
    this.tutorSelecionado = 0;
    this.animalSelecionado = 0;
    this.msgs = [];
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;
      this.isInsercao = false;  
      this.titulo = "Editar";
      this.agendamento.id = registro.id;
      this.agendamento.idTutor = registro.idTutor;
      this.tutorSelecionado = registro.idTutor;
      this.agendamento.nomeTutor = registro.nomeTutor;
      this.agendamento.dataAgendamento = registro.dataAgendamento;
      this.agendamento.horaAgendamento = registro.horaAgendamento;
      this.agendamento.idProcedimento = registro.idProcedimento;
      this.procedimentoSelecionado = registro.idProcedimento;
      this.agendamento.idSala = registro.idSala;
      this.salaSelecionada = registro.idSala;
      this.agendamento.idUsuario = registro.idUsuario;
      this.agendamento.observacao = registro.observacao;
      this.agendamento.idAnimal = registro.idAnimal;
      this.animalSelecionado = registro.idAnimal;
      this.agendamento.nomeAnimal = registro.nomeAnimal;
      this.exibirEdicao = true;
      this.exibirConsulta = false;
      this.exibirCarregando = false;
    } else {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', 'Não é possível alterar um registro desativado.');
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
    if (gridVo.atendido == "0") {
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
    } else {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Esse agendamento já possui consulta vinculada, por isso não pode ser apagado.");
    }
  }

  carregarGridDados() {
    this.exibirCarregando = true;
    if (this.pesquisa.dataAgendamento == undefined) {
      this.pesquisa.dataAgendamento = '';
    }
    this.service.listarDadosAgendamento(this.pesquisa.dataAgendamento).subscribe(res => {

      let retorno: any;
      retorno = res;
      this.gridVo = retorno;
      this.agendamento = retorno;
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
}
