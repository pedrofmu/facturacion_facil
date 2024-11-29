"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const new_invoicen_1 = require("../src/core/invoices/new_invoicen");
const manage_pay_methods_1 = require("../src/infra/comunicate_db/manage_pay_methods");
describe('new invoice', () => {
    it('crear invoicce from usr input', () => __awaiter(void 0, void 0, void 0, function* () {
        const productsTest = [
            {
                cuantity: 4,
                type: "chocolate",
                priceUnit: 10,
                iva: 21,
                discount: 3
            },
        ];
        let invoice = yield (0, new_invoicen_1.generateInvoiceFromUsrInput)("A3", "test", "test2", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");
        expect(invoice.totalPrice).toBe(38.8);
    }));
    it('try obtaining pay method', () => __awaiter(void 0, void 0, void 0, function* () {
        let payMethod = yield (0, manage_pay_methods_1.getAllPayMethodTypes)();
        console.log(payMethod);
        expect(payMethod[0].extraData).toBe(0);
    }));
    //    it('log all pay methods', async () => {
    //        let payMethods = await getAllPayMethodTypes();
    //        console.log(payMethods);
    //    })
    //    it('log all subjects', async () => {
    //        let subjectsEmitter = await getAllSubjectsData("emisor");
    //        console.log(subjectsEmitter);
    //        let subjectsReceiver = await getAllSubjectsData("receptor");
    //        console.log(subjectsReceiver);
    //    })
    //    it('create pdf', async () => {
    //        const productsTest: product[] = [
    //            {
    //                cuantity: 4,
    //                type: "chocolate",
    //                priceUnit: 10,
    //                iva: 21,
    //                discount: 3
    //            },
    //        ];
    //        let invoice = await generateInvoiceFromUsrInput("A", "eduardo", "paquito", "2024-03-10", "2024-03-23", productsTest, "compras test", 21, "detalles", "efectivo", "");
    //
    //
    //        await createPDFfromInvoice(invoice, "/home/pedrofm/temporal/test.pdf");
    //    });
});
