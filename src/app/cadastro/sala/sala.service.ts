import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/internal/Observable";
import { URL_API } from "../../common/utils/utils.service";


@Injectable()
export class SalaService {
 
    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient) {}

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarDadosSala(descricao, listarInativos): Observable<any>{
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/sala/findByFilters`, { params: params });       
    }

    salvarDados(sala) {
        let data = {
            id: sala.id,
            descricao: sala.descricao,
            duracao: sala.duracao
        };
        return this.http.post(`${ URL_API }/sala/save`, data);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/sala/generateCsv`, { params: params });       
    }

    ativarRemoverDados(idSala): Observable<any> {
        return this.http.put(`${ URL_API }/sala/disableOrEnableById/${idSala}`, null);
    }
}