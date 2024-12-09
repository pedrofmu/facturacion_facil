import { generateInvoiceFromUsrInput } from "../src/core/invoices/new_invoicen";
import { createPayMethod } from "../src/infra/comunicate_db/manage_pay_methods";
import { createSubjectData } from "../src/infra/comunicate_db/manage_subject_data";

describe('new invoice', () => {
    it('crear xml de factura', async () => {
//        const productsTest: product[] = [
//            {
//                cuantity: 4,
//                type: "chocolate",
//                priceUnit: 10,
//                iva: 21,
//                discount: 3
//            },
//        ];
//
//        await createSubjectData("Sociedad Anonima S. A.", PersonType.J, "A2800056F", "Sociedad Anonima S. A.", "c/ Alcala, 137", "28001", "Madrid", "Madrid", "", "current", "emisor");
//
//        await createSubjectData("Prima S. A.", PersonType.J, "A4155543L", "Prima S. A.", "c/ San Vicente, 1", "41008", "Sevilla", "Sevilla", "", "current", "receptor");
//
//        await createPayMethod("current", "efectivo", 'IBAN,fecha vencimiento');
//
//        let invoice = await generateInvoiceFromUsrInput("A", "11111111C", "222222C", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");
//
    });
})
