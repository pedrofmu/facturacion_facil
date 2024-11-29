export interface Facturae {
  FileHeader: FileHeader;
  Parties: Parties;
  Invoices: Invoice[];
}

export interface FileHeader {
  SchemaVersion: string;
  Modality: string;
  InvoiceIssuerType: string;
  Batch: Batch;
}

export interface Batch {
  BatchIdentifier: string;
  InvoicesCount: number;
  TotalInvoicesAmount: Amount;
  TotalOutstandingAmount: Amount;
  TotalExecutableAmount: Amount;
  InvoiceCurrencyCode: string;
}

export interface Amount {
  TotalAmount: number;
}

export interface Parties {
  SellerParty: Party;
  BuyerParty: Party;
}

export interface Party {
  TaxIdentification: TaxIdentification;
  Individual?: Individual;
  LegalEntity?: LegalEntity;
}

export interface TaxIdentification {
  PersonTypeCode: string;
  ResidenceTypeCode: string;
  TaxIdentificationNumber: string;
}

export interface Individual {
  Name: string;
  FirstSurname: string;
  SecondSurname: string;
  AddressInSpain: AddressInSpain;
}

export interface LegalEntity {
  CorporateName: string;
  AddressInSpain: AddressInSpain;
}

export interface AddressInSpain {
  Address: string;
  PostCode: string;
  Town: string;
  Province: string;
  CountryCode: string;
}

export interface Invoice {
  InvoiceHeader: InvoiceHeader;
  InvoiceIssueData: InvoiceIssueData;
  TaxesOutputs: TaxOutput[];
  InvoiceTotals: InvoiceTotals;
  Items: InvoiceLine[];
  PaymentDetails: PaymentDetails;
  AdditionalData: AdditionalData;
}

export interface InvoiceHeader {
  InvoiceNumber: string;
  InvoiceSeriesCode: string;
  InvoiceDocumentType: string;
  InvoiceClass: string;
}

export interface InvoiceIssueData {
  IssueDate: string; // Should be in "YYYY-MM-DD" format
  InvoiceCurrencyCode: string;
  TaxCurrencyCode: string;
  LenguageName: string;
}

export interface TaxOutput {
  TaxTypeCode: string;
  TaxRate: number;
  TaxableBase: Amount;
  TaxAmount: Amount;
}

export interface InvoiceTotals {
  TotalGrossAmount: number;
  GeneralDiscounts: Discount[];
  TotalGrossAmountBeforeTaxes: number;
  TotalTaxOutputs: number;
  TotalTaxesWithheld: number;
  InvoiceTotal: number;
  TotalOutstandingAmount: number;
  TotalExecutableAmount: number;
}

export interface Discount {
  DiscountReason: string;
  DiscountRate: number;
  DiscountAmount: number;
}

export interface InvoiceLine {
  ItemDescription: string;
  Quantity: number;
  UnitOfMeasure: string;
  UnitPriceWithoutTax: number;
  TotalCost: number;
  GrossAmount: number;
  TaxesOutputs: TaxOutput[];
  TransactionDate: string; // Should be in "YYYY-MM-DD" format
}

export interface PaymentDetails {
  Installment: Installment[];
}

export interface Installment {
  InstallmentDueDate: string; // Should be in "YYYY-MM-DD" format
  InstallmentAmount: number;
  PaymentMeans: string;
  AccountToBeCredited: AccountToBeCredited;
}

export interface AccountToBeCredited {
  IBAN: string;
}

export interface AdditionalData {
  InvoiceAdditionalInformation: string;
}
