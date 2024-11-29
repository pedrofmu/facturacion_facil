import { generateInvoiceFromUsrInput } from "../src/core/invoices/new_invoicen";
import { getAllPayMethodTypes, getPayMethodType } from "../src/infra/comunicate_db/manage_pay_methods";
import { getAllSubjectsData } from "../src/infra/comunicate_db/manage_subject_data";
import { createPDFfromInvoice } from "../src/infra/manage_files/create_pdf";

describe('new invoice', () => {
    it('crear invoicce from usr input', async () => {
        const productsTest: product[] = [
            {
                cuantity: 4,
                type: "chocolate",
                priceUnit: 10,
                iva: 21,
                discount: 3
            },
        ];
        let invoice = await generateInvoiceFromUsrInput("A3", "test", "test2", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");

        expect(invoice.totalPrice).toBe(38.8);
    });

    it('try obtaining pay method', async () => {
        let payMethod = await getAllPayMethodTypes();
        console.log(payMethod);
        expect(payMethod[0].extraData).toBe(0);
    });

    //    it('log all pay methods', async () => {
    //        let payMethods = await getAllPayMethodTypes();
    //        console.log(payMethods);
    //    })
    //    it('log all subjects', async () => {
    //        let subjectsEmitter = await getAllSubjectsData("emisor");
    //        console.log(subjectsEmitter);
    //        let subjectsReceiver = await getAllSubjectsData("receptor");
    //        console.log(subjectsReceiver);
    //    })
    //    it('create pdf', async () => {
    //        const productsTest: product[] = [
    //            {
    //                cuantity: 4,
    //                type: "chocolate",
    //                priceUnit: 10,
    //                iva: 21,
    //                discount: 3
    //            },
    //        ];
    //        let invoice = await generateInvoiceFromUsrInput("A", "eduardo", "paquito", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");
    //
    //
    //        await createPDFfromInvoice(invoice, "/home/pedrofm/temporal/test.pdf");
    //    });
})
