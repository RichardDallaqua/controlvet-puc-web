import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/internal/Observable";
import { ProcedimentoModel } from "src/app/cadastro/procedimento/procedimento.model";
import { SalaModel } from "src/app/cadastro/sala/sala.model";
import { AnimalModel } from "src/app/cadastro/tutor/animal.model";
import { TutorModel } from "src/app/cadastro/tutor/tutor.model";
import { URL_API } from "../../common/utils/utils.service";


@Injectable()
export class AgendamentoService {
 
    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient) {}

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarProcedimentos(): Observable<ProcedimentoModel> {
        return this.http.get<ProcedimentoModel>(`${ URL_API }/procedimento/findByFilters`);
    }

    listarSalas(): Observable<SalaModel> {
        return this.http.get<SalaModel>(`${ URL_API }/sala/findByFilters`);
    }

    listarTutores(): Observable<any> {
        return this.http.get<TutorModel>(`${ URL_API }/tutor/findByFilters`);
    }

    listarAnimais(idTutor): Observable<AnimalModel> {
        const params = new HttpParams()
          .set('idTutor', idTutor);
        return this.http.get<AnimalModel>(`${ URL_API }/animal/getAnimaisByTutor`, { params: params });
    }

    listarDadosAgendamento(dataPesquisa): Observable<any>{
        const params = new HttpParams()
                    .set('dataPesquisa', dataPesquisa);

        return this.http.get(`${ URL_API }/agendamento/findByFilters`, { params: params });       
    }

    salvarDados(agendamento) {
        let data = {
            id: agendamento.id,
            dataAgendamento: agendamento.dataAgendamento,
            horaAgendamento: agendamento.horaAgendamento,
            idTutor: agendamento.idTutor,
            idAnimal: agendamento.idAnimal,
            idProcedimento: agendamento.idProcedimento,
            idSala: agendamento.idSala,
            idUsuario: agendamento.idUsuario,
            observacao: agendamento.observacao,
        };
        return this.http.post(`${ URL_API }/agendamento/save`, data);
    }

    imprimirRelatorio(dataPesquisa): Observable<any>{
    
        const params = new HttpParams()
                    .set('dataPesquisa', dataPesquisa);

        return this.http.get(`${ URL_API }/agendamento/generateCsv`, { params: params });       
    }

    RemoverDados(idAgendamento): Observable<any> {
        return this.http.delete(`${ URL_API }/agendamento/delete/${idAgendamento}`);
    }
}