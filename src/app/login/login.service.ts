import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UtilsService, URL_API } from '../common/utils/utils.service';

@Injectable()
 export  class LoginService{
    apiURL : string;
    constructor(private http?: HttpClient, private util?: UtilsService){
    }

    sessaoLogada()
    {         
        let usuarioLogado = localStorage.getItem('usuario-login');        
        return usuarioLogado != undefined && usuarioLogado != null;
    }

    nomeUsuario(){
        let usuario = localStorage.getItem('usuario-nome');
        return (usuario != undefined && usuario != null) ? usuario : ""; ;
    }
 
    finalizarSessao(){
        localStorage.removeItem('usuario-login');
        window.location.href = "/" ;
    }

    defineLocalStorare(resposta: any){
        localStorage.setItem('usuario-id', resposta.id)
        localStorage.setItem('usuario-login', resposta.login); 
        localStorage.setItem('usuario-nome', resposta.nome); 
        localStorage.setItem('usuario-idPerfil', resposta.idPerfil);  
        localStorage.setItem('usuario-acessaUsuario', resposta.acessaUsuario);  
        localStorage.setItem('usuario-acessaPerfil', resposta.acessaPerfil);  
        localStorage.setItem('usuario-acessaConsultas', resposta.acessaConsultas);  
        localStorage.setItem('usuario-acessaAgenda', resposta.acessaAgenda);  
        localStorage.setItem('usuario-acessaSala', resposta.acessaSala);  
        localStorage.setItem('usuario-acessaProcedimento', resposta.acessaProcedimento);  
        localStorage.setItem('usuario-acessaVeterinario', resposta.acessaVeterinario);  
        localStorage.setItem('usuario-acessaTutor', resposta.acessaTutor); 
        debugger
        localStorage.setItem('usuario-acessaProduto', resposta.acessaProduto);
    }
     
    autententicar(usuario, senha, nome, isGoogle): Observable<any> {
        const params = new HttpParams()
        .set('usuario', usuario)
        .set('senha', senha)
        .set('nome', nome)
        .set('isGoogle', isGoogle);
        return this.http.get(`${ URL_API }/usuario/loginValidation`, { params: params }); 
    } 
}