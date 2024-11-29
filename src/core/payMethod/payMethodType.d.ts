// la instancia dentro de la tabla metodos de pago
type payMethodType = {
    type: string,
    // csv con los parametros extra ej : fecha_vencimiento,iban
    extraData: string,
}

// la instancia dentro de cada factura
type payMethodEntry = {
    name: string,
    // el array con los datos rellenados
    extraData: string,
}
