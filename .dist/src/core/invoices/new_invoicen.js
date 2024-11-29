"use strict";
// input:
//
// output: numero: string 
//         receptor: subject 
//         emisor: subject 
//         fechEmision: string 
//         fechaVencimiento: string
//         unidades: string (JSON) 
//         concepto: string 
//         importeTotal: number 
//         irpf: number 
//         detalles: string 
//         formaDePago: payMethod 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceFromUsrInput = generateInvoiceFromUsrInput;
const invoice_id_1 = require("../../infra/comunicate_db/invoice_id");
const manage_subject_data_1 = require("../../infra/comunicate_db/manage_subject_data");
const calculate_data_1 = require("./calculate_data");
function generateInvoiceFromUsrInput(letter, receiverId, emitterId, emisionDate, expirationDate, productsList, concept, irpf, details, payMethodName, extraPayMethodData) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (letter === "" || receiverId === "" || emitterId === "" || emisionDate === "" || productsList.length < 1 || concept === "" || irpf === null || payMethodName === "") {
            reject("Faltan datos");
        }
        if (expirationDate.length === 0) {
            expirationDate = "PENDIENTE";
        }
        const number = yield (0, invoice_id_1.getNextInvoiceID)(letter);
        // Valores del pago
        let totalImport = 0;
        let taxableIncome = yield (0, calculate_data_1.obtainTaxableIncomeAsync)(productsList);
        let ivaToAdd = yield (0, calculate_data_1.obtainIVAToAddAsync)(productsList);
        // Calcular el irpf 
        if (irpf > 0) {
            totalImport = taxableIncome + ivaToAdd - (taxableIncome * (irpf / 100));
        }
        else {
            totalImport = taxableIncome + ivaToAdd;
        }
        const receiverData = yield (0, manage_subject_data_1.getSubjectData)(receiverId, "receptor");
        const emitterData = yield (0, manage_subject_data_1.getSubjectData)(emitterId, "emisor");
        const payMethod = {
            name: payMethodName,
            extraData: extraPayMethodData
        };
        const invoice = {
            number: number,
            receiver: receiverData,
            emitter: emitterData,
            emisionDate: emisionDate,
            expirationDate: expirationDate,
            products: productsList,
            concept: concept,
            totalPrice: totalImport,
            irpf: irpf,
            details: details,
            payMethod: payMethod
        };
        resolve(invoice);
    }));
}
