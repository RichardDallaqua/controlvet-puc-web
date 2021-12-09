import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { URL_API, UtilsService } from "../../common/utils/utils.service";

@Injectable()
 export  class FinanceiroService{

    constructor(private http?: HttpClient, private util?: UtilsService){
    }
     
    listarDadosProdutosVendidos(dataInicial, dataFinal): Observable<any>{
        const params = new HttpParams()
            .set('dataInicial', dataInicial)
            .set('dataFinal', dataFinal);
        return this.http.get(`${ URL_API }/relatorio-financeiro/getProdutosVendidos`, { params: params });       
    }
}