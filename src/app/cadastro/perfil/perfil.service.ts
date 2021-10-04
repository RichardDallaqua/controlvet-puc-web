import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/internal/Observable";
import { URL_API, UtilsService } from "../../common/utils/utils.service";


@Injectable()
export class PerfilService {
 

    formGroup: FormGroup;
    formBuilder: FormBuilder;
    constructor(private http?: HttpClient) {
      
    }

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarDadosPerfil(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/perfil/findByFilters`, { params: params });       
    }

    salvarDados(perfil) {
        let data = {
            id: perfil.id,
            descricao: perfil.descricao,
            acessaAgenda: perfil.acessaAgenda,
            acessaConsultas: perfil.acessaConsultas,
            acessaPerfil: perfil.acessaPerfil,
            acessaProcedimento: perfil.acessaProcedimento,
            acessaSala: perfil.acessaSala,
            acessaTutor: perfil.acessaTutor,
            acessaUsuario: perfil.acessaUsuario,
            acessaVeterinario: perfil.acessaVeterinario,
            acessaProduto: perfil.acessaProduto
        };
        return this.http.post(`${ URL_API }/perfil/save`, data);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/perfil/generateCsv`, { params: params });       
    }

    ativarRemoverDados(idPerfil): Observable<any> {
        return this.http.put(`${ URL_API }/perfil/disableOrEnableById/${idPerfil}`, null);
    }


}