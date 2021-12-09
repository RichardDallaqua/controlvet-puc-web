import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/internal/Observable";
import { URL_API, UtilsService } from "../../common/utils/utils.service";


@Injectable()
export class ProdutoService {
 
    formGroup: FormGroup;
    formBuilder: FormBuilder;

    constructor(public util: UtilsService, 
        private http?: HttpClient) {}

    formulario() {
        this.formGroup = this.formBuilder.group({
          'exibeInativosFiltro': [null, null]
        });        
    }

    listarDadosProduto(descricao, listarInativos): Observable<any>{
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/produto/findByFilters`, { params: params });       
    }

    salvarDados(produto) {
        let data = {
            id: produto.id,
            descricao: produto.descricao,
            valor: this.util.formatarDecimalParaCalculo(produto.valor)
        };
        return this.http.post(`${ URL_API }/produto/save`, data);
    }

    imprimirRelatorio(descricao, listarInativos): Observable<any>{
    
        const params = new HttpParams()
                    .set('descricao', descricao)
                    .set('listarInativos', listarInativos);

        return this.http.get(`${ URL_API }/produto/generateCsv`, { params: params });       
    }

    ativarRemoverDados(idProduto): Observable<any> {
        return this.http.put(`${ URL_API }/produto/disableOrEnableById/${idProduto}`, null);
    }

    buscaProdutoPorId(idProduto): Observable<any>{
        return this.http.get(`${ URL_API }/produto/findById/${idProduto}`);       
    }
}