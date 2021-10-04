import * as $ from 'jquery';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { Message, LazyLoadEvent, MessageService } from 'primeng/api';
import { tipoMensagem } from '../enum/tipo-mensagem';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { LazyLoadDto } from '../model/lazy-load.model';
import { AbstractControl, Validators } from '@angular/forms';

export var URL_API: '';

@Injectable()
export class UtilsService {

    pt: any;
    constructor(private http: HttpClient, private messageService: MessageService, private router?: Router) {
        this.pt = {
            firstDayOfWeek: 0,
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            today: 'Hoje',
            clear: 'Limpar'
        };
    }

    buscarUrl(): Observable<any> {
        this.http.get<any>(this.getEnvironment()).subscribe(res => {
            let retorno: any;
            retorno = res;
            return URL_API = retorno.urlServices;
        });
        return this.http.get<any>('assets/controlvetconfig.json');
    }

    getEnvironment() {  
            return "assets/controlvetconfig.json";
    }


    loadUrlServices() {
        this.buscarUrl().subscribe(res => {
            let object: any;
            object = res;
            return object.urlServices;
        });
    };


    exibirMensagemSobreposicao(tipo: string, titulo: string, mensagem: string) {
        this.messageService.add({severity: tipo, summary: titulo, detail: mensagem});
    }

    limparMensagemSobreposicao(msg: Message[]) {
        msg = [];
    }

    numeroDecimal(valor) {
        return valor.replace(/[^1234567890,]+/g, ',');
    }

    numero(valor) {
        if (valor == "" || valor == undefined || valor == null) {
            valor = null;
        } else {
            valor = valor.replace(/[^1234567890]+/g, '');
        }
        return valor;
    }

    base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    saveByteArray(reportName, byte) {
        var blob = new Blob([byte]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = reportName;
        link.download = fileName;
        link.click();
    }

    /**
     * Verifica se o conteúdo passado como parâmetro é null, empty ou undefined
     * @param conteudo 
     */
    isNullEmptyUndefined(conteudo: string) {
        if (conteudo == undefined) {
            return true;
        }
        if (typeof conteudo == "string" && (conteudo.trim() == null || conteudo.trim() == "")) {
            return true;
        }
        return false;
    }

    /**
     * Valida se uma data é válida
     * @param data 
     */
    monthYearIsValid(data) {
        let mes = data.split('/')[0];
        let ano = data.split('/')[1];
        let dataAux = new Date(mes + "/01/" + ano);
        if (!(!!new Date(dataAux).getTime())) {
            return false;
        }
        return true;
    }
 
    cnpjValidator(field) {
        if ($.type(field) == "undefined") {
            return false;
        }

        var cnpj = ($.type(field) == "string" ? field.trim().replace(/\D+/g, '') : field.val().trim().replace(/\D+/g, ''));
        if (cnpj.length != 14) {
            return false;
        }

        if (this.isSameCharInString(cnpj)) {
            return false;
        }
        var primeiroDigito = 0;
        var segundoDigito = 0;
        var pesos = '543298765432';
        var soma = 0;
        var isValid = false;
        for (var i = 0; i < pesos.length; i++) {
            soma += (parseInt(cnpj.charAt(i)) * parseInt(pesos.charAt(i)));
        }
        primeiroDigito = (soma % 11);
        primeiroDigito = (primeiroDigito < 2) ? 0 : (11 - primeiroDigito);
        soma = 0;
        pesos = '6543298765432';
        for (i = 0; i < pesos.length; i++) {
            soma += (parseInt(cnpj.charAt(i)) * parseInt(pesos.charAt(i)));
        }
        segundoDigito = (soma % 11);
        segundoDigito = (segundoDigito < 2) ? 0 : (11 - segundoDigito);
        if (cnpj.charAt(12) == primeiroDigito && cnpj.charAt(13) == segundoDigito) {
            isValid = true;
        }
        return isValid;
    }

    isSameCharInString(sender) {

        if ($.type(sender) == "undefined") {
            return false;
        }

        var value = ($.type(sender) == "string" ? sender.trim() : sender.val().trim());
        value = value.replace(/[^a-z0-9]/gi, '');

        if (value.length <= 1) {
            return false;
        }

        var result = true;

        var c = value.substring(0, 1);

        for (var i = 1; i < value.length; i++) {
            var d = value.substring(i, i + 1);

            if (c != d) {
                result = false;
                break;
            }
        }

        return result;
    }

    validaCPF(cpf): boolean {
        if (cpf == null) {
            return false;
        }
        if (cpf.length != 11) {
            return false;
        }
        if ((cpf == '00000000000') || (cpf == '11111111111') || (cpf == '22222222222') || (cpf == '33333333333') || (cpf == '44444444444') || (cpf == '55555555555') || (cpf == '66666666666') || (cpf == '77777777777') || (cpf == '88888888888') || (cpf == '99999999999')) {
            return false;
        }
        let numero: number = 0;
        let caracter: string = '';
        let numeros: string = '0123456789';
        let j: number = 10;
        let somatorio: number = 0;
        let resto: number = 0;
        let digito1: number = 0;
        let digito2: number = 0;
        let cpfAux: string = '';
        cpfAux = cpf.substring(0, 9);
        for (let i: number = 0; i < 9; i++) {
            caracter = cpfAux.charAt(i);
            if (numeros.search(caracter) == -1) {
                return false;
            }
            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
        }
        resto = somatorio % 11;
        digito1 = 11 - resto;
        if (digito1 > 9) {
            digito1 = 0;
        }
        j = 11;
        somatorio = 0;
        cpfAux = cpfAux + digito1;
        for (let i: number = 0; i < 10; i++) {
            caracter = cpfAux.charAt(i);
            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
        }
        resto = somatorio % 11;
        digito2 = 11 - resto;
        if (digito2 > 9) {
            digito2 = 0;
        }
        cpfAux = cpfAux + digito2;
        if (cpf != cpfAux) {
            return false;
        }
        else {
            return true;
        }
    }

    validaEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    adicionarDiasData(dias) {
        var hoje = new Date();
        var dataVenc = new Date(hoje.getTime() + (dias * 24 * 60 * 60 * 1000));
        return (dataVenc.getMonth().toString().length == 1 ? "0" : "") + (dataVenc.getMonth() + 1) + "/" + dataVenc.getFullYear();
    }

    adicionarMesData(meses) {
        let now = new Date();

        let month = now.getMonth();
        now.setMonth(month + meses);
        let hoje = new Date();

        let mes = now.getMonth() + 1;

        return (mes.toString().length == 1 ? "0" : "") + mes + "/" + now.getFullYear();
    }


    /**
     * Retorna diferença em dias entre duas datas
     * 
     * @param dataInicial 
     * @param dataFinal 
     */
    retornaEmDiasDiferencaEntreDatas(dataInicial, dataFinal) {
        // variáveis auxiliares
        var minuto = 60000;
        var dia = minuto * 60 * 24;
        var horarioVerao = 0;

        // ajusta o horario de cada objeto Date
        dataInicial.setHours(0);
        dataInicial.setMinutes(0);
        dataInicial.setSeconds(0);
        dataFinal.setHours(0);
        dataFinal.setMinutes(0);
        dataFinal.setSeconds(0);

        // determina o fuso horário de cada objeto Date
        var fh1 = dataInicial.getTimezoneOffset();
        var fh2 = dataFinal.getTimezoneOffset();

        // retira a diferença do horário de verão
        if (dataFinal > dataInicial) {
            horarioVerao = (fh2 - fh1) * minuto;
        }
        else {
            horarioVerao = (fh1 - fh2) * minuto;
        }

        var dif = Math.abs(dataFinal.getTime() - dataInicial.getTime()) - horarioVerao;

        return Math.ceil(dif / dia);
    }

    textLineThrough(valor) {
        return (valor == null ? '' : 'text-line-through')
    }

    focusComponent(id) {
        setTimeout(function () { $(`#${id}`).focus(); }, 50);
        setTimeout(function () { $(`input[name=${id}]`).focus(); }, 50);
    }

    disableComponent(id, disable) {
        $(`#${id}`).prop("disabled", disable);
    }

    disableComponent2(id) {
        $(`#${id}`).prop('disabled', true);
    }


    /**
    * Função formata valor Pt-BR
    * 
    * Enviar como parâmetro o id do Input
    * @param param  
    */
    formataReal(param) {
        let int = $("#" + param).val();
        if (int == "") {
            int = 0;
        }

        int = int.toString().replace(",", "");
        int = int.toString().replace(".", "");
        let tmp = int + "";

        if (tmp.length == 1) {
            tmp = "0" + tmp;
        } else {
            if (tmp.length >= 3) {
                if (tmp.substring(0, 1) == "0") {
                    tmp = tmp.replace(tmp.substring(0, 1), "");
                }
            }
        }
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6) {
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        }

        return tmp;

    }

    //FortmataMoedaFloatParaString  
    fortmataMoedaFloatParaString(numero) {

        if ($.type(numero) == "string") {
            return numero;
        }
        if (numero !== "" && numero != undefined && numero != null) {

            var numero = numero.toFixed(2).split('.');
            numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
            return numero.join(',');
        }

        return "";
    }

    //FortmataMoedaStringParaString  
    FortmataMoedaStringParaString(valor) {

        if (valor === "" || valor == undefined || valor == null) {
            valor = null;
        } else {

            valor = valor.replace(",", "")
            while (valor.toString().indexOf(".") >= 0) {
                valor = valor.replace(".", "")
            }

            valor = (parseInt(valor.replace(/\.,/g, '')) / 100)
            valor = this.number_format(parseFloat(valor.toString()), 2, ",", ".");

            // if (valor == "0,00") { return null; }
        }
        return valor;
    }


    number_format(number, decimals, dec_point, thousands_sep) {
        var n = number, prec = decimals;

        var toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return (Math.round(n * k) / k).toString();
        };

        n = !isFinite(+n) ? 0 : +n;
        prec = !isFinite(+prec) ? 0 : Math.abs(prec);
        var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
        var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

        var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

        var abs = toFixedFix(Math.abs(n), prec);
        var _, i;

        if (parseInt(abs) >= 1000) {
            _ = abs.split(/\D/);
            i = _[0].length % 3 || 3;

            _[0] = s.slice(0, i + (n < 0)) + _[0].slice(i).replace(/(\d{3})/g, sep + '$1');
            s = _.join(dec);
        }
        else {
            s = s.replace('.', dec);
        }

        var decPos = s.indexOf(dec);

        if (prec >= 1 && decPos !== -1 && (s.length - decPos - 1) < prec) {
            s += new Array(prec - (s.length - decPos - 1)).join("0") + '0';
        }
        else if (prec >= 1 && decPos === -1) {
            s += dec + new Array(prec).join("0") + '0';
        }

        return s;
    }

    formatarDecimalParaCalculo(valor) {

        if (valor === "" || valor == undefined || valor == null) {
            return null;
        } else {

            if ($.type(valor) == "string") {
                valor = valor.replace(".", ",").replace(",", ".");
            }
            valor = parseFloat(valor);
        }
        return valor
    }
    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    removeCaracter(texto, caracter) {
        if (texto != undefined && texto != null) {
            while (texto.indexOf(caracter) > -1) {
                texto = texto.replace(caracter, "");
            }
        }
        return texto;
    }

    btnDonwload(arquivo) {
        var sampleArr = this.base64ToArrayBuffer(arquivo);
        this.saveByteArray("log erro.txt", sampleArr);
    }

    convertToDateForString(data, mascara) {

        if (data === "" || data == undefined || data == null) {
            return null;
        } else {
            if (typeof data != "string") {
                data = moment(data).format(mascara);
            }
        }
        return data
    }

    convertToStringForDate(data, mascara) {

        if (!(data instanceof Date)) {

            if (data === "" || data == undefined || data == null) {
                return null;
            } else {
                if (typeof data != "string") {
                    data = moment(data).format(mascara);
                } else {

                    if (mascara == "MM/YYYY") {
                        data = new Date(("01/" + data).split('/').reverse().join('/'));
                    } else if (mascara == "DD/MM/YYYY") {
                        data = new Date(data);
                    }
                }
            }
        }
        return data
    }




    getLazyDto(event: LazyLoadEvent): LazyLoadDto {

        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        let lazyLoad = null;

        if (event != null) {
            lazyLoad = new LazyLoadDto();

            lazyLoad.pagina = event.first / event.rows;
            lazyLoad.linhas = event.rows;
            if (event.multiSortMeta != null) {
                lazyLoad.campoOrdenacao = event.multiSortMeta[0].field;
                lazyLoad.ordem = event.multiSortMeta[0].order;
            }
        }

        return lazyLoad;
    }

    formataMonthPicker(object, properties, event) {

        if (new Date(event.srcElement.value.split('/')[0] + "/01/" + event.srcElement.value.split('/')[1]).toLocaleDateString('pt-br') == "Invalid Date") {
            object[properties] = "";
        } else {

            let r: any;
            r = new Date(event.srcElement.value.split('/')[0] + "/01/" + event.srcElement.value.split('/')[1]);
            object[properties] = r;

        }
    }


    mesAnoStringtab(obj, key) {

        let d = new Date();
        if (($(`#${key}`).val().length == 1) && ($(`#${key}`).val() == 1)) {
            $(`#${key}`).val("0" + $(`#${key}`).val());
        }

        if ($(`#${key}`).val().length < 7) {
            $(`#${key}`).val($(`#${key}`).val().replace("/", ""));
        }

        if ($(`#${key}`).val() >= 1 && $(`#${key}`).val() <= 12) {
            obj[`${key}`] = this.mascaraData($(`#${key}`).val() + "/" + d.getUTCFullYear().toString());

            $(`#${key}`).val(this.mascaraData($(`#${key}`).val() + "/" + d.getUTCFullYear().toString()));
        }

    }

    mesAnoString(obj, key) {



        $(`#${key}`).val(this.mascaraData($(`#${key}`).val()));

        if ($(`#${key}`).val().length == 7) {
            obj[`${key}`] = $(`#${key}`).val();
        }
    }

    mesAnotab(obj, key) {
        let d = new Date();
        $(`#${key}`).val($(`#${key}`).val().replace("/", ""));

        if ($(`#${key}`).val() >= 1 && $(`#${key}`).val() <= 12) {
            obj[`${key}`] = this.convertToStringForDate($(`#${key}`).val() + "/" + d.getUTCFullYear().toString(), "MM/YYYY");

            $(`#${key}`).val(this.mascaraData($(`#${key}`).val() + "/" + d.getUTCFullYear().toString()));
        }

    }

    mesAno(obj, key) {

        $(`#${key}`).val(this.mascaraData($(`#${key}`).val()));

        if ($(`#${key}`).val().length == 7) {
            obj[`${key}`] = this.convertToStringForDate($(`#${key}`).val(), "MM/YYYY");
        }
    }

    mascaraData(v) {

        v = v.replace(/[^1234567890/]+/g, '');

        if ((v.length == 2) && (v == "1/")) {
            v = "0" + v;
        }

        if ((v.length == 1) && (v == 2 || v == 3 || v == 4 || v == 5 || v == 6 || v == 7 || v == 8 || v == 9)) {
            v = "0" + v;
        }

        if ((v.length == 2) && (v > 12)) {
            v = v.substring(0, 1);
        }

        if (v.length >= 7) {
            v = v.substring(0, 7);
        }

        v = v.replace("/", "").replace("/", "");

        v = v.replace(/(\d{2})(\d)/, "$1/$2")

        if (v.length == 2) {
            v = v + "/";
        }

        return v
    }


    diaMesAno(obj, key) {
 
        let v = $(`#${key}`).val();
        v = v.replace(/[^1234567890/]+/g, '');

        v = v.replace(/\D/g, "")

        v = v.replace(/(\d{2})(\d)/, "$1/$2")

        v = v.replace(/(\d{2})(\d)/, "$1/$2")

        if (v.length == 2) {
            v = v + "/";
        } else if (v.length == 5) {
            v = v + "/";
        }

        $(`#${key}`).val(v);
    }

    diaMesAnoTab(obj, key) {
        let d = new Date();

        let v = $(`#${key}`).val();
        v = v.replace(/\D/g, "");
        v = v.replace(/(\d{2})(\d)/, "$1/$2");
        v = v.replace(/(\d{2})(\d)/, "$1/$2");

        if (v.length == 1 && (v == "1" || v == "2" || v == "3" || v == "4" || v == "5" || v == "6" || v == "7" || v == "8" || v == "9")) {

            v = "0" + v + "/" + d.toLocaleDateString('pt-br').substring(3, 10);
        } else if (v.length == 2) {

            v = v + "/" + d.toLocaleDateString('pt-br').substring(3, 10);
        } else if (v.length == 4) {

            v = v.split('/')[0] + "/0" + v.split('/')[1] + "/" + d.toLocaleDateString('pt-br').substring(6, 10)
        }
        else if (v.length == 5) {

            v = v + "/" + d.toLocaleDateString('pt-br').substring(6, 10)
        }

        
        if (this.validateDate(v)) {
            $(`#${key}`).val(v);
            obj[`${key}`] = this.convertToStringForDate(v, "MM/DD/YYYY");
        } else {
            $(`#${key}`).val("");
            obj[`${key}`] = null;
        }
    }

    validateDate(value) {
        var RegExPattern = /^((((0?[1-9]|[12]\d|3[01])[\.\-\/](0?[13578]|1[02])      [\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|[12]\d|30)[\.\-\/](0?[13456789]|1[012])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|1\d|2[0-8])[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|(29[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|1\d|2[0-8])02((1[6-9]|[2-9]\d)?\d{2}))|(2902((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$/;

        if (!((value.match(RegExPattern)) && (value != ''))) {
            return false;
        }
        else {
            return true;
        }
    }

    ultimoDiaMes(date):any{
        //var date = new Date();
        var primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1);
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
}

