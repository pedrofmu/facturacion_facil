/* 
// XML filler data
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<namespace:Facturae xmlns:namespace2="http://uri.etsi.org/01903/v1.2.2#" xmlns:namespace3="http://www.w3.org/2000/09/xmldsig#" xmlns:namespace="http://www.facturae.es/Facturae/2007/v3.0/Facturae">





*/

import { obtainIVAToAddSync, obtainTaxableIncomeAsync, obtainTaxableIncomeSync } from "./calculate_data";
import xmlFormatter from 'xml-formatter';


function createHeader(invoice: Invoice): string {
    return `<FileHeader>
		<SchemaVersion>3.0</SchemaVersion>
		<Modality>I</Modality>
		<InvoiceIssuerType>EM</InvoiceIssuerType>
		<Batch>
			<BatchIdentifier>${"Buscar que va aqui"}</BatchIdentifier>
			<InvoicesCount>1</InvoicesCount>
			<TotalInvoicesAmount>
				<TotalAmount>${invoice.totalPrice}</TotalAmount>
			</TotalInvoicesAmount>
			<TotalOutstandingAmount>
				<TotalAmount>${invoice.totalPrice}</TotalAmount>
			</TotalOutstandingAmount>
			<TotalExecutableAmount>
				<TotalAmount>${invoice.totalPrice}</TotalAmount>
			</TotalExecutableAmount>
			<InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
		</Batch>
	</FileHeader>`
}

function createParties(invoice: Invoice) {
    const createPartyData = (party: Subject) => {
        let partyString = `<TaxIdentification>
				<PersonTypeCode>${party.personType}</PersonTypeCode>
				<ResidenceTypeCode>${party.residentType}</ResidenceTypeCode>
				<TaxIdentificationNumber>${party.id}</TaxIdentificationNumber>
			</TaxIdentification>`;

        if (party.personType == PersonType.F) {
            let dividedName = party.name.split(',');
            partyString += `<Individual>
                                <Name>${dividedName[0]}</Name>
                                <FirstSurname>${dividedName[1]}</FirstSurname>
                                <SecondSurname>${dividedName[2] ? dividedName[2] : ""}</SecondSurname>
                                <AddressInSpain>
                                    <Address>${party.address}</Address>
                                    <PostCode>${party.postCode}</PostCode>
                                    <Town>${party.town}</Town>
                                    <Province>${party.province}</Province>
                                    <CountryCode>ESP</CountryCode>
                                </AddressInSpain>
                            </Individual>`;
        } else if (party.personType == PersonType.J) {
            partyString += `<LegalEntity>
                                <CorporateName>${party.name}</CorporateName>
                                <AddressInSpain>
                                    <Address>${party.address}</Address>
                                    <PostCode>${party.postCode}</PostCode>
                                    <Town>${party.town}</Town>
                                    <Province>${party.province}</Province>
                                    <CountryCode>ESP</CountryCode>
                                </AddressInSpain>
                            </LegalEntity>`;

        }

        return partyString;
    };

    return `<Parties>
		<SellerParty>
		    ${createPartyData(invoice.emitter)}	
		</SellerParty>
		<BuyerParty>
			${createPartyData(invoice.receiver)}
		</BuyerParty>
	</Parties>`;
}

type TaxValue = {
    taxableBase: number,
    taxAmount: number
};

interface TaxType {
    [key: number]: TaxValue;
}

function createInvoiceBody(invoice: Invoice): string {
    const createTax = (products: Product[]) => {
        let returnString: string = ``;
        let allTax: TaxType = [];

        for (let i = 0; i < products.length; i++) {
            const unit = products[i];
            const iva = unit.iva;

            const bi = unit.cuantity * unit.priceUnit - (unit.cuantity * unit.priceUnit * (unit.discount / 100));
            const ivaToAdd = bi * (iva / 100);

            if (!allTax.hasOwnProperty(unit.iva)) {
                allTax[unit.iva] = {
                    taxableBase: bi,
                    taxAmount: ivaToAdd
                };
            } else {
                allTax[unit.iva].taxableBase += bi;
                allTax[unit.iva].taxAmount += ivaToAdd;
            }
        }

        for (const key in allTax) {
            returnString += `<Tax>
					<TaxTypeCode>01</TaxTypeCode>
					<TaxRate>${key}</TaxRate>
					<TaxableBase>
						<TotalAmount>${allTax[key].taxableBase}</TotalAmount>
					</TaxableBase>
					<TaxAmount>
						<TotalAmount>${allTax[key].taxAmount}</TotalAmount>
					</TaxAmount>
				</Tax>`;
        }

        return returnString;
    };

    const createIssuerContractReference = (): string => {
        // Ejemplo de formato: "C" seguido de un timestamp o un identificador generado.
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
        return `C${timestamp.substring(0, 12)}`; // CYYYYMMDDHHMM
    };

    const createIssuerTransactionReference = (): string => {
        // Ejemplo de formato: "T" seguido de un número aleatorio o un identificador incremental.
        const randomId = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
        return `T${randomId}`;
    };

    const generateItemLines = (products: Product[], date: string) => {
        let returnString: string = "";

        for (let i = 0; i < products.length; i++) {
            const bi = products[i].cuantity * products[i].priceUnit - (products[i].cuantity * products[i].priceUnit * (products[i].discount / 100));
            const ivaToAdd = bi * (products[i].iva / 100);

            returnString += `				<InvoiceLine>
					<IssuerContractReference>${createIssuerContractReference()}</IssuerContractReference>
					<IssuerTransactionReference>${createIssuerTransactionReference()}</IssuerTransactionReference>
					<ItemDescription>${products[i].type}</ItemDescription>
					<Quantity>${products[i].cuantity}</Quantity>
					<UnitOfMeasure>01</UnitOfMeasure>
					<UnitPriceWithoutTax>${products[i].priceUnit}</UnitPriceWithoutTax>
					<TotalCost>${bi + ivaToAdd}</TotalCost>
					<GrossAmount>${bi + ivaToAdd}</GrossAmount>
					<TaxesOutputs>
						<Tax>
							<TaxTypeCode>01</TaxTypeCode>
							<TaxRate>${products[i].iva}</TaxRate>
							<TaxableBase>
								<TotalAmount>${bi}</TotalAmount>
							</TaxableBase>
							<TaxAmount>
								<TotalAmount>${ivaToAdd}</TotalAmount>
							</TaxAmount>
						</Tax>
					</TaxesOutputs>
					<TransactionDate>${date}</TransactionDate>
				</InvoiceLine>`
        }

        return returnString;
    };

    const createPaymentDetails = (invoice: Invoice) => {
        switch (invoice.payMethod.name) {
            case "efectivo":
                return "";
            case "transferencia bancaria":
                return `            <PaymentDetails>
                <Installment>
                    <InstallmentDueDate>${invoice.payMethod.extraData[1]}</InstallmentDueDate>
                    <InstallmentAmount>${invoice.totalPrice}</InstallmentAmount>
                    <PaymentMeans>04</PaymentMeans>
                    <AccountToBeCredited>
                        <IBAN>${invoice.payMethod.extraData[0]}</IBAN>
                    </AccountToBeCredited>
                </Installment>
            </PaymentDetails>`;
            default:
                throw new Error("Not implemented pay method in xml generation");
        }
    };

    let rawPrice: number = obtainTaxableIncomeSync(invoice.products);
    let IVAToAdd: number = obtainIVAToAddSync(invoice.products);
    let retainedIRPF: number = rawPrice * invoice.irpf / 100;

    console.warn(rawPrice, IVAToAdd, retainedIRPF);

    return `	<Invoices>
		<Invoice>
			<InvoiceHeader>
				<InvoiceNumber>${invoice.number}</InvoiceNumber>
				<InvoiceDocumentType>FC</InvoiceDocumentType>
				<InvoiceClass>OO</InvoiceClass>
			</InvoiceHeader>
			<InvoiceIssueData>
				<IssueDate>${invoice.emisionDate}</IssueDate>
				<InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
				<TaxCurrencyCode>EUR</TaxCurrencyCode>
				<LanguageName>ESP</LanguageName>
			</InvoiceIssueData>
			<TaxesOutputs>
			    ${createTax(invoice.products)}	
			</TaxesOutputs>
			<InvoiceTotals>
				<TotalGrossAmount>${rawPrice - retainedIRPF}</TotalGrossAmount>
				<TotalGrossAmountBeforeTaxes>${rawPrice}</TotalGrossAmountBeforeTaxes>
				<TotalTaxOutputs>${IVAToAdd}</TotalTaxOutputs>
				<TotalTaxesWithheld>${retainedIRPF}</TotalTaxesWithheld>
				<InvoiceTotal>${rawPrice - retainedIRPF + IVAToAdd}</InvoiceTotal>
				<TotalOutstandingAmount>${rawPrice - retainedIRPF + IVAToAdd}</TotalOutstandingAmount>
				<TotalExecutableAmount>${rawPrice - retainedIRPF + IVAToAdd}</TotalExecutableAmount>
			</InvoiceTotals>
			<Items>
                ${generateItemLines(invoice.products, invoice.emisionDate)}
		    </Items>
                ${createPaymentDetails(invoice)}
		</Invoice>
	</Invoices>`;
}

export function generateXMLHacienda(invoice: Invoice): string {
    let xmlString: string = `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    <namespace:Facturae
	xmlns:namespace2="http://uri.etsi.org/01903/v1.2.2#"
	xmlns:namespace3="http://www.w3.org/2000/09/xmldsig#"
	xmlns:namespace="http://www.facturae.es/Facturae/2007/v3.0/Facturae">
    ${createHeader(invoice)}
    ${createParties(invoice)}
    ${createInvoiceBody(invoice)}
    </namespace:Facturae>`;

    return xmlFormatter(xmlString, {
        indentation: '   ',
        collapseContent: true,
    });
}
