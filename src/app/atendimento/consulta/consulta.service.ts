import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/internal/Observable";
import { ProdutoModel } from "src/app/cadastro/produto/produto.model";
import { URL_API } from "../../common/utils/utils.service";


@Injectable()
export class ConsultaService {
 
    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient) {}

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    carregarConsulta(idAgendamento): Observable<any>{
        const params = new HttpParams()
                    .set('idAgendamento', idAgendamento);

        return this.http.get(`${ URL_API }/consulta/findByagendamento`, { params: params });       
    }

    listarDadosConsulta(dataPesquisa): Observable<any>{
        const params = new HttpParams()
                    .set('dataPesquisa', dataPesquisa);

        return this.http.get(`${ URL_API }/consulta/findByFilters`, { params: params });       
    }

    salvarDados(consulta) {
        return this.http.post(`${ URL_API }/consulta/save`, consulta);
    }

    imprimirRelatorio(dataPesquisa): Observable<any>{
    
        const params = new HttpParams()
                    .set('dataPesquisa', dataPesquisa);

        return this.http.get(`${ URL_API }/consulta/generateCsv`, { params: params });       
    }

    RemoverDados(idConsulta): Observable<any> {
        return this.http.delete(`${ URL_API }/consulta/delete/${idConsulta}`);
    }
    
}