import { SalaComponent } from "src/app/cadastro/sala/sala.component";

export class AgendamentoModel{
    id: number;
    dataAgendamento: string;
    horaAgendamento: string;
    dataCadastro: string;
    idTutor: number;
    nomeTutor: string;
    idAnimal: number;
    nomeAnimal: string;
    idProcedimento: number;
    descricaoProcedimento: string;
    idSala: number;
    descricaoSala: string;
    idUsuario: string;
    nomeUsuario: string;
    observacao: string;
    atendido: string;
}

export class PesquisaModel{
  dataAgendamento: string;
}