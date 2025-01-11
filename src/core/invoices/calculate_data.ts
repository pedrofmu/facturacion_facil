export function obtainTaxableIncomeAsync(products: Product[]): Promise<number> {
    return new Promise((resolve) => {
        let taxableIncome = 0;
        for (let i = 0; i < products.length; i++) {
            const bi = products[i].cuantity * products[i].priceUnit - (products[i].cuantity * products[i].priceUnit * (products[i].discount / 100));
            taxableIncome += bi;
        }

        resolve(taxableIncome);
    });
}

export function obtainTaxableIncomeSync(products: Product[]): number {
    let taxableIncome = 0;
    for (let i = 0; i < products.length; i++) {
        const bi = products[i].cuantity * products[i].priceUnit - (products[i].cuantity * products[i].priceUnit * (products[i].discount / 100));
        taxableIncome += bi;
    }

    return taxableIncome;
}

export function obtainIVAToAddAsync(products: Product[]): Promise<number> {
    return new Promise((resolve) => {
        let ivaToAdd = 0;
        for (let i = 0; i < products.length; i++) {
            const iva = products[i].iva;

            const bi = products[i].cuantity * products[i].priceUnit - (products[i].cuantity * products[i].priceUnit * (products[i].discount / 100));
            ivaToAdd += bi * (iva / 100);
        }

        resolve(ivaToAdd);
    });
}

export function obtainIVAToAddSync(products: Product[]): number {
    let ivaToAdd = 0;
    for (let i = 0; i < products.length; i++) {
        const iva = products[i].iva;

        const bi = products[i].cuantity * products[i].priceUnit - (products[i].cuantity * products[i].priceUnit * (products[i].discount / 100));
        ivaToAdd += bi * (iva / 100);
    }

    return ivaToAdd;
}

export function obtainIvaQuotasAsync(products: Product[]): Promise<string[]> {
    return new Promise((resolve) => {
        const ivasQuotes: Set<string> = new Set();

        for (let i = 0; i < products.length; i++) {
            const iva = products[i].iva;
            ivasQuotes.add(`${iva}%`);
        }

        resolve(Array.from(ivasQuotes));
    });
}
