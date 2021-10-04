import { LazyLoadDto } from "../../common/model/lazy-load.model";

export class UsuarioModel {

    id: number;
    nome: String;
    login: String;
    senha: String;
    dataCadatro: String;
    dataDesativacao: String;
    idPerfil: number;
    perfil: String;
    lazyDto: LazyLoadDto; 
 }