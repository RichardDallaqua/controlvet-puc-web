import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/internal/Observable";
import { URL_API } from "../../common/utils/utils.service";


@Injectable()
export class ProcedimentoService {
 
    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient) {}

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarDadosProcedimento(descricao, listarInativos): Observable<any>{
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/procedimento/findByFilters`, { params: params });       
    }

    salvarDados(procedimento) {
        let data = {
            id: procedimento.id,
            descricao: procedimento.descricao,
            duracao: procedimento.duracao
        };
        return this.http.post(`${ URL_API }/procedimento/save`, data);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/procedimento/generateCsv`, { params: params });       
    }

    ativarRemoverDados(idProcedimento): Observable<any> {
        return this.http.put(`${ URL_API }/procedimento/disableOrEnableById/${idProcedimento}`, null);
    }
}