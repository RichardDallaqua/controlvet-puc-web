import * as $ from 'jquery'
import { Injectable } from '@angular/core';


@Injectable()
export class ValidacaoService {
    constructor() {

    }

    menssagem(seletor, msg) {
        $(`#${seletor}-error`).html(msg);
        $(`#${seletor}`).focus(); $(`input[name=${seletor}]`).focus();

    }

    menssagemSemFocus(seletor, msg) {
        $(`#${seletor}-error`).html(msg);

    }

    limpaMesangem(seletor) {
        $(`#${seletor}-error`).html("");
        $("input[name=" + `${seletor}` + "]").removeClass("requiredInput");
    }

    limpaVariasMesangens(campos: string[]) {
        for (var i = 0; i < campos.length; i++) {
            let seletor = campos[i];
            $(`#${seletor}-error`).html("");
            $("input[name=" + `${seletor}` + "]").removeClass("requiredInput");
            $(`#${seletor}`).find( "span" ).removeClass("requiredInput");
        }
    }

    obrigatorio(campos: string[]) {
        let status = true;

        for (var i = 0; i < campos.length; i++) {
            let seletor = campos[i];
            if ($(`#${seletor}  option:selected`).val() != undefined) {

                if ($(`#${seletor}  option:selected`).val() == "null" || $(`#${seletor}  option:selected`).val() == "Selecione...") {
                    $(`#${seletor}-error`).html("Campo obrigatório!");
                    $("option[name=" + `${seletor}` + "]").addClass("requiredInput");
                    if (status) { $(`#${seletor}  option:selected`).focus(); }
                    status = false;
                } else {
                    $(`#${seletor}-error`).html("");
                }
            } else {
                if ($(`#${seletor}`).find("input").val() != undefined) {
                    if ($(`#${seletor}`).find("input").val().length <= 0) {
                         $(`#${seletor}-error`).html("Campo obrigatório!");
                        $(`#${seletor}`).find( "span" ).addClass("requiredInput");
                    }
                } else {
                    if ($(`#${seletor}`).val() != undefined) {
                        if ($(`#${seletor}`).val().length <= 0 && $(`input[name=${seletor}]`).val() == null) {
                            $(`#${seletor}-error`).html("Campo obrigatório!");
                            $("input[name=" + `${seletor}` + "]").addClass("requiredInput");
                            if (status) { 
                                setTimeout(function () { $(`#${seletor}`).focus(); }, 50); setTimeout(function () { $(`input[name=${seletor}]`).focus(); }, 50); 
                            }
                            status = false;
                        } else {
                            $("input[name=" + `${seletor}` + "]").removeClass("requiredInput");
                            $(`#${seletor}-error`).html("");
                        }
                }
                }
            }

        }

        return status;
    }

    valorIguais(primeiroSeletor: string, segundoSeletor: string) {

        let status = true;

        if ($(`#${primeiroSeletor}`).val() != $(`#${segundoSeletor}`).val()) {
            $(`#${segundoSeletor}-error`).html("As senhas não são iguais!");
            $(`#${segundoSeletor}`).focus();
            status = false;
        } else {
            $(`#${segundoSeletor}-error`).html("");
            status = true;
        }

        return status;
    }

    caracteresMaior(seletor: string, length: number) {

        let status = true;

        if ($(`#${seletor}`).val().length < length) {
            $(`#${seletor}-error`).html(`O campo precisa ter no mínimo ${length} caracteres!"`);
            $(`#${seletor}`).focus();
            status = false;
        } else {
            $(`#${seletor}-error`).html("");
            status = true;
        }

        return status;
    }

    validaMesInicialMesFinal(mesInicial, mesFinal, msgMesInicial, MsgMesfinal) {


        this.limpaVariasMesangens([msgMesInicial, MsgMesfinal]);
        let status = true;
        let mesInicio;
        if (mesInicial != undefined && mesInicial != "") {
            mesInicio = new Date(("01/" + mesInicial).split('/').reverse().join('/'));

            if (!(!!new Date(mesInicio).getTime())) {
                this.menssagem(msgMesInicial, "O mês/ano inválido.");
                status = false;
            }
        } else {
            mesInicial = undefined;
            status = true;
        }

        let mesFim;
        if (mesFinal != undefined && mesFinal != "") {
            mesFim = new Date(("01/" + mesFinal).split('/').reverse().join('/'));

            if (!(!!new Date(mesFim).getTime())) {
                this.menssagem(MsgMesfinal, "O mês/ano inválido.");
                status = false;
            }
        } else {
            mesFinal = undefined;
            status = true;
        }

        if (mesInicial == undefined && mesFinal != undefined) {
            this.menssagem(msgMesInicial, "Informe mês/ano inicial.");
            status = false;
        }

        if (mesInicial != undefined && mesFinal == undefined) {
            this.menssagem(MsgMesfinal, "Informe mês/ano final.");
            status = false;
        }

        if (mesFinal != undefined && mesInicial != undefined) {
            if (mesFim < mesInicio) {
                this.menssagem(MsgMesfinal, "O mês/ano final não pode ser menor que mês/ano inicial.");
                status = false;
            }
        }


        return status;
    }

    validaDataInicialDataFinal(mesInicial, mesFinal, msgMesInicial, MsgMesfinal) {


        this.limpaVariasMesangens([msgMesInicial, MsgMesfinal]);
        let status = true;
        let mesInicio;
        if (mesInicial != undefined && mesInicial != "") {
            mesInicio = new Date(mesInicial.split('/')[1] + "/" + mesInicial.split('/')[0] + "/" + mesInicial.split('/')[2]);

            if (!(!!new Date(mesInicio).getTime())) {
                this.menssagemSemFocus(msgMesInicial, "Data inválido.");
                status = false;
            }
        } else {
            mesInicial = undefined;
            status = true;
        }

        let mesFim;
        if (mesFinal != undefined && mesFinal != "") {
            mesFim = new Date(mesFinal.split('/')[1] + "/" + mesFinal.split('/')[0] + "/" + mesFinal.split('/')[2]);

            if (!(!!new Date(mesFim).getTime())) {
                this.menssagemSemFocus(MsgMesfinal, "Data inválido.");
                status = false;
            }
        } else {
            mesFinal = undefined;
            status = true;
        }

        if (mesInicial == undefined && mesFinal != undefined) {
            this.menssagemSemFocus(msgMesInicial, "Informe data inicial.");
            status = false;
        }

        if (mesInicial != undefined && mesFinal == undefined) {
            this.menssagemSemFocus(MsgMesfinal, "Informe data final.");
            status = false;
        }

        if (mesFinal != undefined && mesInicial != undefined) {
            if (mesFim < mesInicio) {
                this.menssagemSemFocus(MsgMesfinal, "O período final não pode ser menor que período inicial.");
                status = false;
            }
        }


        return status;
    }

    validaData(data) {

        if (!(!!new Date(new Date(data)).getTime())) {
            return false;
        }
        return true
    }


}