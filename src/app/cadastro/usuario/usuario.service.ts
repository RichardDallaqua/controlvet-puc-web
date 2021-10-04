import { ComboModel } from "../../common/model/combo-model";
import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";
import { UtilsService, URL_API } from "../../common/utils/utils.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { UsuarioModel } from "./usuario.model";
import { FormGroup, FormBuilder } from '@angular/forms';
import { PerfilModel } from "./../perfil/perfil.model";

@Injectable()
export class UsuarioService {
 

    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient, private util?: UtilsService) {
      
    }

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarPerfis(): Observable<PerfilModel> {
        return this.http.get<PerfilModel>(`${ URL_API }/perfil/findByFilters`);
    }

    listarDadosUsuario(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/usuario/findByFilters`, { params: params });       
    }

    // listarDados(usuarioFiltro, exibeInativoFiltro, lazyDtoParam, id): Observable<any> {

    //     const headers = new HttpHeaders()
    //       .set('Content-Type', 'application/json')
    //       .set('authorization', 'Bearer ' + localStorage.getItem('usuario-erp-menu'));

    //     const data = {
    //         usuarioFiltro: usuarioFiltro,
    //         exibeInativoFiltro: exibeInativoFiltro,
    //         lazyDto: lazyDtoParam,
    //         codigoUsuario: id
    //       };

    //     return this.http.post(URL_API_ERP_MENU + 'usuario/pesquisar', data,  { headers });
    // }

    salvarDados(usuario) {
        let data = {
            id: usuario.id,
            nome: usuario.nome,
            login: usuario.login,
            senha: usuario.senha,
            idPerfil: usuario.idPerfil             
        };
        return this.http.post(`${ URL_API }/usuario/save`, data);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/usuario/generateCsv`, { params: params });       
    }

    ativarRemoverDados(idUsuario): Observable<any> {
        return this.http.put(`${ URL_API }/usuario/disableOrEnableById/${idUsuario}`, null);
    }


}