import { generateInvoiceFromUsrInput } from "../src/core/invoices/new_invoicen";
import { createSubjectData } from "../src/infra/comunicate_db/manage_subject_data";
import { createPDFfromInvoice } from "../src/infra/manage_files/create_pdf";

describe('new invoice', () => {
    it('crear invoicce from usr input', async () => {
        await createSubjectData(PersonType.J, "222222C", "Yolanda Muñoz", "Calle superfantastica", "01234", "Alcoy", "Alicante", "test@test.xyz", "current", "emisor");
        await createSubjectData(PersonType.J, "A4155543L", "Prima S. A.", "c/ San Vicente, 1", "41008", "Sevilla", "Sevilla", "", "current", "receptor");
        const productsTest: Product[] = [
            {
                cuantity: 4,
                type: "chocolate",
                priceUnit: 10,
                iva: 21,
                discount: 3
            },
        ];
        let invoice = await generateInvoiceFromUsrInput("A", "A4155543L", "222222C", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");

        expect(invoice.emitter.name).toBe("Yolanda Muñoz");
    });

    it('create pdf', async () => {
        await createSubjectData(PersonType.J, "222222C", "Yolanda Muñoz", "Calle superfantastica", "01234", "Alcoy", "Alicante", "test@test.xyz", "current", "emisor");
        await createSubjectData(PersonType.J, "A4155543L", "Prima S. A.", "c/ San Vicente, 1", "41008", "Sevilla", "Sevilla", "", "current", "receptor");
        const productsTest: Product[] = [
            {
                cuantity: 4,
                type: "chocolate",
                priceUnit: 10,
                iva: 21,
                discount: 3
            },
        ];
        let invoice = await generateInvoiceFromUsrInput("A", "A4155543L", "222222C", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");


        await createPDFfromInvoice(invoice, "/home/pedrofm/temporal/test.pdf");
    });
})
