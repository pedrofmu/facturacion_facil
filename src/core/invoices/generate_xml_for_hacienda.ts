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
			<BatchIdentifier>A2800056FBX-375-09</BatchIdentifier>
			<InvoicesCount>1</InvoicesCount>
			<TotalInvoicesAmount>
				<TotalAmount>7557.48</TotalAmount>
			</TotalInvoicesAmount>
			<TotalOutstandingAmount>
				<TotalAmount>7557.48</TotalAmount>
			</TotalOutstandingAmount>
			<TotalExecutableAmount>
				<TotalAmount>7557.48</TotalAmount>
			</TotalExecutableAmount>
			<InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
		</Batch>
	</FileHeader>`
}

function createParties(invoice: Invoice) {
   return `<Parties>
		<SellerParty>
			<TaxIdentification>
				<PersonTypeCode>J</PersonTypeCode>
				<ResidenceTypeCode>R</ResidenceTypeCode>
				<TaxIdentificationNumber>A2800056F</TaxIdentificationNumber>
			</TaxIdentification>
			<LegalEntity>
				<CorporateName>Sociedad Anonima S. A.</CorporateName>
				<AddressInSpain>
					<Address>c/ Alcala, 137</Address>
					<PostCode>28001</PostCode>
					<Town>Madrid</Town>
					<Province>Madrid</Province>
					<CountryCode>ESP</CountryCode>
				</AddressInSpain>
			</LegalEntity>
		</SellerParty>
		<BuyerParty>
			<TaxIdentification>
				<PersonTypeCode>J</PersonTypeCode>
				<ResidenceTypeCode>R</ResidenceTypeCode>
				<TaxIdentificationNumber>A4155543L</TaxIdentificationNumber>
			</TaxIdentification>
			<LegalEntity>
				<CorporateName>Prima S. A.</CorporateName>
				<AddressInSpain>
					<Address>c/ San Vicente, 1</Address>
					<PostCode>41008</PostCode>
					<Town>Sevilla</Town>
					<Province>Sevilla</Province>
					<CountryCode>ESP</CountryCode>
				</AddressInSpain>
			</LegalEntity>
		</BuyerParty>
	</Parties>`; 
}

function createInvoiceBody(invoice: Invoice): string {
    return `	<Invoices>
		<Invoice>
			<InvoiceHeader>
				<InvoiceNumber>A1</InvoiceNumber>
				<InvoiceDocumentType>FC</InvoiceDocumentType>
				<InvoiceClass>OO</InvoiceClass>
			</InvoiceHeader>
			<InvoiceIssueData>
				<IssueDate>2009-03-02</IssueDate>
				<InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
				<TaxCurrencyCode>EUR</TaxCurrencyCode>
				<LanguageName>ESP</LanguageName>
			</InvoiceIssueData>
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
