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
        let invoice = await generateInvoiceFromUsrInput("A", "11111111C", "222222C", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");

        expect(invoice.emitter.name).toBe("Yolanda Muñoz");
    });
    
    it('create pdf', async () => {
        const productsTest: product[] = [
            {
                cuantity: 4,
                type: "chocolate",
                priceUnit: 10,
                iva: 21,
                discount: 3
            },
        ];
        let invoice = await generateInvoiceFromUsrInput("A", "11111111C", "222222C", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");
    
    
        await createPDFfromInvoice(invoice, "/home/pedrofm/temporal/test.pdf");
    });
})
