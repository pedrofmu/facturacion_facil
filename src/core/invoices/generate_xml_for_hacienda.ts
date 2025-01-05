/* 
// XML filler data
<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<namespace:Facturae xmlns:namespace2="http://uri.etsi.org/01903/v1.2.2#" xmlns:namespace3="http://www.w3.org/2000/09/xmldsig#" xmlns:namespace="http://www.facturae.es/Facturae/2007/v3.0/Facturae">





*/


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
    const createTax = (products: product[]) => {
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
				<TotalGrossAmount>6678.00</TotalGrossAmount>
				<TotalGrossAmountBeforeTaxes>6678.00</TotalGrossAmountBeforeTaxes>
				<TotalTaxOutputs>879.48</TotalTaxOutputs>
				<TotalTaxesWithheld>0.00</TotalTaxesWithheld>
				<InvoiceTotal>7557.48</InvoiceTotal>
				<TotalOutstandingAmount>7557.48</TotalOutstandingAmount>
				<TotalExecutableAmount>7557.48</TotalExecutableAmount>
			</InvoiceTotals>
			<Items>
				<InvoiceLine>
					<IssuerContractReference>C070801</IssuerContractReference>
					<IssuerTransactionReference>C0107</IssuerTransactionReference>
					<ItemDescription>Cuadernos</ItemDescription>
					<Quantity>500.0</Quantity>
					<UnitOfMeasure>01</UnitOfMeasure>
					<UnitPriceWithoutTax>9.156000</UnitPriceWithoutTax>
					<TotalCost>4578.00</TotalCost>
					<GrossAmount>4578.00</GrossAmount>
					<TaxesOutputs>
						<Tax>
							<TaxTypeCode>01</TaxTypeCode>
							<TaxRate>16.00</TaxRate>
							<TaxableBase>
								<TotalAmount>4578.00</TotalAmount>
							</TaxableBase>
							<TaxAmount>
								<TotalAmount>732.48</TotalAmount>
							</TaxAmount>
						</Tax>
					</TaxesOutputs>
					<TransactionDate>2009-03-02</TransactionDate>
				</InvoiceLine>
				<InvoiceLine>
					<IssuerContractReference>C070801</IssuerContractReference>
					<IssuerTransactionReference>C0107</IssuerTransactionReference>
					<ItemDescription>Libros</ItemDescription>
					<Quantity>60.0</Quantity>
					<UnitOfMeasure>01</UnitOfMeasure>
					<UnitPriceWithoutTax>35.000000</UnitPriceWithoutTax>
					<TotalCost>2100.00</TotalCost>
					<GrossAmount>2100.00</GrossAmount>
					<TaxesOutputs>
						<Tax>
							<TaxTypeCode>01</TaxTypeCode>
							<TaxRate>7.00</TaxRate>
							<TaxableBase>
								<TotalAmount>2100.00</TotalAmount>
							</TaxableBase>
							<TaxAmount>
								<TotalAmount>147.00</TotalAmount>
							</TaxAmount>
						</Tax>
					</TaxesOutputs>
					<TransactionDate>2009-03-02</TransactionDate>
				</InvoiceLine>
			</Items>
            <PaymentDetails>
                <Installment>
                    <InstallmentDueDate>2007-01-12</InstallmentDueDate>
                    <InstallmentAmount>212.87</InstallmentAmount>
                    <PaymentMeans>04</PaymentMeans>
                    <AccountToBeCredited>
                        <IBAN>ESP00431111601111111111</IBAN>
                    </AccountToBeCredited>
                </Installment>
            </PaymentDetails>
		</Invoice>
	</Invoices>`;
}

export function generateXMLHacienda(invoice: Invoice): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    <namespace:Facturae
	xmlns:namespace2="http://uri.etsi.org/01903/v1.2.2#"
	xmlns:namespace3="http://www.w3.org/2000/09/xmldsig#"
	xmlns:namespace="http://www.facturae.es/Facturae/2007/v3.0/Facturae">
    ${createHeader(invoice)}
    ${createParties(invoice)}
    ${createInvoiceBody(invoice)}
    </namespace:Facturae>`;
}
