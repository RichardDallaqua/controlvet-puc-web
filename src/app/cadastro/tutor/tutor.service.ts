import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/internal/Observable";
import { URL_API, UtilsService } from "../../common/utils/utils.service";

@Injectable()
export class TutorService {
 

    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient, private util?: UtilsService) {
      
    }

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarDadosTutor(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/tutor/findByFilters`, { params: params });       
    }

    salvarDados(tutor) {
        return this.http.post(`${ URL_API }/tutor/save`, tutor);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/tutor/generateCsv`, { params: params });       
    }

    imprimirRelatorioAnimal(idTutor): Observable<any>{
    
        const params = new HttpParams()
                    .set('idTutor', idTutor)

        return this.http.get(`${ URL_API }/animal/generateCsv`, { params: params });       
    }

    ativarRemoverDados(idTutor): Observable<any> {
        return this.http.put(`${ URL_API }/tutor/disableOrEnableById/${idTutor}`, null);
    }


}