import { generateXMLHacienda } from "../src/core/invoices/generate_xml_for_hacienda";
import { generateInvoiceFromUsrInput } from "../src/core/invoices/new_invoicen";
import { createSubjectData } from "../src/infra/comunicate_db/manage_subject_data";

describe('new invoice', () => {
    it('crear xml de factura', async () => {
        const productsTest: Product[] = [
            {
                cuantity: 500,
                type: "Cuadernos",
                priceUnit: 9.156,
                iva: 16,
                discount: 0 
            },
            {
                cuantity: 60,
                type: "Libros",
                priceUnit: 35.00,
                iva: 7,
                discount: 0 
            },
        ];

        await createSubjectData(PersonType.J, "A2800056F", "Sociedad Anonima S. A.", "c/ Alcala, 137", "28001", "Madrid", "Madrid", "", "current", "emisor");

        await createSubjectData(PersonType.F, "A4155543L", "Yolanda,Muñoz,Del Aguila", "c/ San Vicente, 1", "41008", "Sevilla", "Sevilla", "", "current", "receptor");

        const invoice = await generateInvoiceFromUsrInput("A", "A4155543L", "A2800056F", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");

        const xmlResult = generateXMLHacienda(invoice);

        console.log(xmlResult);

        expect(typeof(xmlResult)).toBe(typeof(""));
    });
})
