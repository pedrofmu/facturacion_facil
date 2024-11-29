type product = {
    cuantity: number,
    type: string,
    priceUnit: number,
    iva: number,
    discount: number
}

type invoice = {
    number: string,
    receiver: subject,
    emitter: subject,
    emisionDate: string,
    expirationDate: string,
    products: product[],
    concept: string,
    totalPrice: number,
    irpf: number,
    details: string,
    payMethod: payMethodEntry
}

interface rowInvoice  {
    numero: string,
    receptor: string,
    emisor: string,
    fechaEmision: string,
    fechaVencimiento: string,
    unidades: string,
    concepto: string,
    importeTotal: number,
    irpf: number,
    detalles: string,
    formaDePago: string
}
