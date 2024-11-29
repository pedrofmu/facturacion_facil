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

import { getNextInvoiceID } from "../../infra/comunicate_db/invoice_id";
import { getSubjectData } from "../../infra/comunicate_db/manage_subject_data";
import { obtainIVAToAddAsync, obtainTaxableIncomeAsync } from "./calculate_data";

export function generateInvoiceFromUsrInput(letter: string, receiverId: string, emitterId: string, emisionDate: string, expirationDate: string, productsList: product[], concept: string, irpf: number, details: string, payMethodName: string, extraPayMethodData: string): Promise<invoice> {
    return new Promise(async (resolve, reject) => {
        if (letter === "" || receiverId === "" || emitterId === "" || emisionDate === "" || productsList.length < 1 || concept === "" || irpf === null || payMethodName === "") {
            reject("Faltan datos");
        }

        if (expirationDate.length === 0) {
            expirationDate = "PENDIENTE";
        }

        const number = await getNextInvoiceID(letter);

        // Valores del pago
        let totalImport: number = 0;
        let taxableIncome: number = await obtainTaxableIncomeAsync(productsList);
        let ivaToAdd: number = await obtainIVAToAddAsync(productsList);

        // Calcular el irpf 
        if (irpf > 0) {
            totalImport = taxableIncome + ivaToAdd - (taxableIncome * (irpf / 100));
        } else {
            totalImport = taxableIncome + ivaToAdd;
        }

        const receiverData: subject = await getSubjectData(receiverId, "receptor");
        const emitterData: subject = await getSubjectData(emitterId, "emisor");

        const payMethod: payMethodEntry = {
            name: payMethodName,
            extraData: extraPayMethodData 
        };

        const invoice: invoice = {
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
    });
}

