"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtainTaxableIncomeAsync = obtainTaxableIncomeAsync;
exports.obtainIVAToAddAsync = obtainIVAToAddAsync;
exports.obtainIvaQuotasAsync = obtainIvaQuotasAsync;
function obtainTaxableIncomeAsync(products) {
    return new Promise((resolve) => {
        let taxableIncome = 0;
        for (let i = 0; i < products.length; i++) {
            const bi = products[i].cuantity * products[i].priceUnit - (products[i].cuantity * products[i].priceUnit * (products[i].discount / 100));
            taxableIncome += bi;
        }
        resolve(taxableIncome);
    });
}
function obtainIVAToAddAsync(products) {
    return new Promise((resolve) => {
        let ivaToAdd = 0;
        for (let i = 0; i < products.length; i++) {
            const iva = products[i].iva;
            const bi = products[i].cuantity * products[i].priceUnit - (products[i].cuantity * products[i].priceUnit * (products[i].discount / 100));
            ivaToAdd += bi * (iva / 100);
            resolve(ivaToAdd);
        }
    });
}
function obtainIvaQuotasAsync(products) {
    return new Promise((resolve) => {
        const ivasQuotes = new Set();
        for (let i = 0; i < products.length; i++) {
            const iva = products[i].iva;
            ivasQuotes.add(`${iva}%`);
        }
        resolve(Array.from(ivasQuotes));
    });
}
