export class ConsultaModel{
    id: number;
    anamnese: string;
    tratamento: string;
    prescricao: string;
    idListaProduto: number;
    idAgendamento: number;
    valorTotal: number;
    idMaxItem: number;
    itensConsultaDto = [];
}
