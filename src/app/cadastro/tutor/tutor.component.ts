import { Component, OnInit } from '@angular/core';
import { Message, ConfirmationService } from 'primeng/api';
import { tipoMensagem } from 'src/app/common/enum/tipo-mensagem';
import { Erro } from 'src/app/common/model/erro-model';
import { PesquisaModel } from 'src/app/common/model/pesquisa.model';
import { UtilsService } from 'src/app/common/utils/utils.service';
import { ValidacaoService } from 'src/app/common/validacao/validacao.service';
import { TutorModel } from './tutor.model'
import { AnimalModel } from './animal.model'
import { TutorService } from './tutor.service'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css']
})
export class TutorComponent implements OnInit {

  msgs: Message[] = [];
  titulo: string;

  exibirConsulta: any = true;
  exibirEdicao: any = false;
  exibirCarregando: any = false;
  colunas: any[];
  modelTutor = new TutorModel();
  pesquisa = new PesquisaModel();
  gridVo: any[];

  exibirGridAnimal: any = true;
  modelAnimal = new AnimalModel();
  animalGridVo: any[];
  idAnimal = 0;
  animalVo: any[];
  colunasAnimal: any[];
  isEdicaoAnimal: boolean = false;

  constructor(private confirmationService: ConfirmationService,
    private validacao: ValidacaoService,
    public util: UtilsService,
    private service: TutorService,
    private titleService: Title
  ) {
  }

  ngOnInit() {
    this.util.buscarUrl().subscribe(res => {
      this.carregarGridDados();
    });

    this.colunas = [
      { field: 'id', header: 'ID', width: "10%" },
      { field: 'nome', header: 'Nome', width: "50%" },
      { field: 'dataCadastro', header: 'Data Cadastro', width: "40%" },
    ];

    this.colunasAnimal = [
      { field: 'nome', header: 'Nome', width: "30%" },
      { field: 'raca', header: 'Raça', width: "10%" },
      { field: 'sexo', header: 'Sexo', width: "10%" },
      { field: 'especie', header: 'Especie', width: "10%" },      
      { field: 'peso', header: 'Peso', width: "20%" },
      { field: 'dataNascimento', header: 'Data Nascimento', width: "20%" },
    ];
    this.titleService.setTitle('ControlVet - Tutor');
    this.titulo = "Pesquisar";
  }

  btnPesquisar() {
    this.exibirCarregando = true;
    this.carregarGridDados();
    this.exibirCarregando = false;
  }

  btnSalvarDados() {
    if (this.validacaoDadosTutor()){
      this.salvar();
    }
  }

  salvar() {
    this.exibirCarregando = true;
    this.exibirGridAnimal = true;
    this.modelTutor.animalVo = this.animalGridVo;
    this.service.salvarDados(this.modelTutor).subscribe(res => {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.success, "Sucesso", "Registros salvo com sucesso!");
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
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.titulo = "Cadastrar";
    this.validacao.limpaMesangem("msg");
    this.util.focusComponent("nome");
    this.animalGridVo = null;
  }

  btnVoltarTelaPrincipal() {
    this.exibirConsulta = true;
    this.exibirEdicao = false;
    this.exibirGridAnimal = true;
    this.limparDadosEdicao();
    this.carregarGridDados();
    this.titulo = "Pesquisar";
  }
  
  limparDadosEdicao() {
    this.modelTutor = new TutorModel();
  }

  btnAlterarDados(registro) {
    if (registro.dataDesativacao == null || registro.dataDesativacao == "") {
      this.exibirCarregando = true;
      this.modelTutor = registro;
      this.animalGridVo = registro.animalVo;

      this.titulo = "Editar";

      this.exibirEdicao = true;
      this.exibirConsulta = false;
      this.exibirCarregando = false;
    } else {
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', 'Não é possível alterar um registro desativado.');
    }
  }

  btnAtivarRemoverDados(gridVo) {
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
          this.msgs = [];
          this.util.exibirMensagemSobreposicao(tipoMensagem.warn, 'Atenção', err.error);
          break;
        default:
          this.util.exibirMensagemSobreposicao(tipoMensagem.error, 'Atenção', "Erro interno, contate o suporte: " + err.error);
      }
    });
  }

  carregarGridDados() {
    this.exibirCarregando = true;
    this.service.listarDadosTutor(this.pesquisa.nomeFiltro, this.pesquisa.exibeInativosFiltro).subscribe(res => {

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

  validacaoDadosTutor() {
    let status = true;
    if (!this.validacao.obrigatorio(["modelTutor.nome", "modelTutor.telefone", "modelTutor.endereco"])) {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Preencha os campos obrigatórios.");
      status = false;
    }

    debugger
    if (!this.util.validaCPF(this.modelTutor.cpf)) {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "O CPF informado não é válido.");
      status = false;
    }
    return status;
  }

  // <============= Funções Animal ==================>

  validacaoDadosAnimal() {
    let status = true;
    if (!this.validacao.obrigatorio(["modelAnimal.nome", "modelAnimal.raca", "modelAnimal.peso",
                                     "modelAnimal.dataNascimento", "modelAnimal.sexo",
                                     "modelAnimal.especie"])) {
      this.msgs = [];
      this.util.exibirMensagemSobreposicao(tipoMensagem.warn, "Atenção", "Preencha os campos obrigatórios.");
      status = false;
    }
    return status;
  }

  adicionarAnimal() {
    this.isEdicaoAnimal = false;
    let retorno = this.animalGridVo;   
    this.modelTutor.idMaxItem = this.modelTutor.idMaxItem + 1;
    this.idAnimal = this.modelTutor.idMaxItem;
    this.modelAnimal.id = this.idAnimal;

    if (retorno == undefined) {
      retorno = [];
    }

    retorno.push(
      {
        id: this.idAnimal,
        descricao: this.modelAnimal.nome,
        raca: this.modelAnimal.raca,
        especie: this.modelAnimal.especie,
        sexo: this.modelAnimal.sexo,
        peso: this.modelAnimal.peso,
        dataNascimento: this.modelAnimal.dataNascimento
      }
    );

    this.animalGridVo = retorno;
  }

  btnSalvarDadosAnimal() {
    if (this.validacaoDadosAnimal()) {
      this.salvarDadosAnimal()
    }
  }

  salvarDadosAnimal(){
    this.exibirCarregando = true;
    let index = this.animalGridVo.findIndex(x => x['id'] === this.idAnimal);

    this.animalGridVo[index].nome = this.modelAnimal.nome;
    this.animalGridVo[index].raca = this.modelAnimal.raca;
    this.animalGridVo[index].especie = this.modelAnimal.especie;
    this.animalGridVo[index].sexo = this.modelAnimal.sexo;
    this.animalGridVo[index].peso = this.modelAnimal.peso;
    this.animalGridVo[index].dataNascimento = this.modelAnimal.dataNascimento;
    
    this.exibirGridAnimal = true;
    this.exibirCarregando = false;

    this.limparCamposAnimal();
  }

  btnVoltarAnimal() {
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.exibirGridAnimal = true;
    this.modelAnimal = new AnimalModel();
    if (!this.isEdicaoAnimal) {
      this.btnRemoverAnimal(this.idAnimal);
    }
  }

  btnRemoverAnimal(registro) {
    let index = null;
    index = this.animalGridVo.findIndex(x => x['id'] === registro.id);
    this.animalGridVo.splice(index, 1);
  }

  limparCamposAnimal() {
    this.modelAnimal = new AnimalModel();
  }

  btnAlterarDadosAnimal(registro) {
    this.exibirGridAnimal = false;
    this.isEdicaoAnimal = true;
    this.idAnimal = registro.id;

    let index = null;
    index = this.animalGridVo.findIndex(x => x['id'] === this.idAnimal);
    let retorno = this.animalGridVo[index];

    this.modelAnimal.id = retorno.id;
    this.modelAnimal.nome = retorno.nome;
    this.modelAnimal.raca = retorno.raca;
    this.modelAnimal.especie = retorno.especie,
    this.modelAnimal.sexo = retorno.sexo,
    this.modelAnimal.peso = retorno.peso,
    this.modelAnimal.dataNascimento = retorno.dataNascimento
  }

  btnGridCSVAnimal() {
    this.exibirCarregando = true;

    this.service.imprimirRelatorioAnimal(this.modelTutor.id).subscribe(res => {
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

  btnAdicionarAnimal() {
    this.exibirConsulta = false;
    this.exibirEdicao = true;
    this.exibirGridAnimal = false;

    this.adicionarAnimal();
  }

}