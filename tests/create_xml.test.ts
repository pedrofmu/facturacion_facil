import { generateInvoiceFromUsrInput } from "../src/core/invoices/new_invoicen";
import { createSubjectData } from "../src/infra/comunicate_db/manage_subject_data";

describe('new invoice', () => {
    it('crear xml de factura', async () => {
        const productsTest: product[] = [
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

        await createSubjectData(PersonType.J, "A4155543L", "Prima S. A.", "c/ San Vicente, 1", "41008", "Sevilla", "Sevilla", "", "current", "receptor");
    });
})
