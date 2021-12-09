import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UtilsService, URL_API } from "../../common/utils/utils.service";

@Injectable()
 export  class AtendimentoService{

    constructor(private http?: HttpClient, private util?: UtilsService){
    }
     
    listarDadosrelatorioSalas(dataInicial, dataFinal): Observable<any>{
        const params = new HttpParams()
            .set('dataInicial', dataInicial)
            .set('dataFinal', dataFinal);
        return this.http.get(`${ URL_API }/relatorio-atendimento/getRelatorioSalas`, { params: params });       
    }

    listarDadosrelatorioProcedimento(dataInicial, dataFinal): Observable<any>{
        const params = new HttpParams()
            .set('dataInicial', dataInicial)
            .set('dataFinal', dataFinal);
        return this.http.get(`${ URL_API }/relatorio-atendimento/getRelatorioProcedimentos`, { params: params });       
    }

    listarDadosrelatorioAtendimento(dataInicial, dataFinal): Observable<any>{
        const params = new HttpParams()
            .set('dataInicial', dataInicial)
            .set('dataFinal', dataFinal);
        return this.http.get(`${ URL_API }/relatorio-atendimento/getRelatorioAtendimentos`, { params: params });       
    }
}