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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPDFfromInvoice = createPDFfromInvoice;
const calculate_data_1 = require("../../core/invoices/calculate_data");
const get_paths_1 = require("../manage_env/get_paths");
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = require("fs");
const util_1 = require("util");
const readFileAsync = (0, util_1.promisify)(fs_1.readFile);
function createHTMLforProducts(productsList) {
    return new Promise((resolve) => {
        var htmlString = "";
        productsList.forEach((product) => {
            const cuantity = product.cuantity;
            const priceUnit = product.priceUnit;
            const iva = product.iva;
            const discount = cuantity * priceUnit * (product.discount / 100);
            const taxableIncome = (cuantity * priceUnit) - discount;
            const ivaAdd = taxableIncome * (iva / 100);
            htmlString += `
                <tr>
                  <td>${product.type}</th>
                  <td>${Number(priceUnit).toFixed(2)}€</th>
                  <td>${cuantity}</th>
                  <td>${discount.toFixed(2)}€</th>
                  <td>${taxableIncome.toFixed(2)}€</th>
                  <td>${ivaAdd.toFixed(2)}€</th>
                  <td>${(taxableIncome + ivaAdd).toFixed(2)}€</th>
                </tr>`;
        });
        resolve(htmlString);
    });
}
function generateHtmlFromInvoice(invoice) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const cssRendering = yield readFileAsync((0, get_paths_1.getCSSPath)(), 'utf-8');
            const taxableIncome = yield (0, calculate_data_1.obtainTaxableIncomeAsync)(invoice.products);
            const ivaToAdd = yield (0, calculate_data_1.obtainIVAToAddAsync)(invoice.products);
            const ivasQuota = yield (0, calculate_data_1.obtainIvaQuotasAsync)(invoice.products);
            const imgPath = yield (0, get_paths_1.getImagePathAsync)();
            const imageData = yield readFileAsync(imgPath);
            const imageB64 = imageData.toString('base64');
            const productsHtml = yield createHTMLforProducts(invoice.products);
            let restIRPF = 0;
            if (invoice.irpf > 0) {
                restIRPF = taxableIncome - (taxableIncome * invoice.irpf / 100);
            }
            let htmlRender = `<!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>factura</title>
      <style>${cssRendering}</style>
  </head>
  <body>
      <div class="header">
          <div class="remitente">
              <h5><i>proveedor</i></h5>
              <h4><b>${invoice.emitter.name}</b></h4>
              <h5>${invoice.emitter.id}</h5>
              <h5>${invoice.emitter.address}</h5>
              <h5>${invoice.emitter.contact}</h5>
          </div>
          <img src="data:image/png;base64,${imageB64}">
      </div>
      <div class="datos1">
          <div class="comprador">
              <h5><i>cliente</i></h5>
              <h4><b>${invoice.receiver.name}</b></h4>
              <h5>${invoice.receiver.id}</h5>
              <h5>${invoice.receiver.address}</h5>
              <h5>${invoice.receiver.contact}</h5>
          </div>
          <div class="datos_id_factura">
              <h5><b>factura: </b> ${invoice.number}</h5>
              <h5><b>fecha emision: </b>${invoice.emisionDate}</h5>
              <h5><b>fecha fencimiento: </b>${invoice.expirationDate}</h5>
          </div>
      </div>
      <table id="productos">
          <tr>
              <th>Concepto</th>
              <th>Precio unitario</th>
              <th>Unidades</th>
              <th>DTO.</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
          </tr>
          ${productsHtml}
      </table>
      <div class="datos2">
          <div class="pago_total">
              <h5>Total Base Imponible: ${taxableIncome.toFixed(2)}€</h5>
              <h5>Retenido IRPF: ${restIRPF.toFixed(2)}€</h5>
              <h5>Añadido por IVA (${ivasQuota}): ${ivaToAdd.toFixed(2)}€</h5>
              <h5>Importe total: ${invoice.totalPrice.toFixed(2)}€</h5>
          </div>
          <div class="forma_pago">
              <h4>Forma de pago: </h4>
              <h5>${invoice.payMethod.name}   ${invoice.payMethod.extraData}</h5>
          </div>
      </div>
      <div class="detalles_extra">
         ${invoice.details ? `<p>${invoice.details}</p>` : ''}
      </div>
  </body>
  </html>
  `;
            resolve(htmlRender);
        }));
    });
}
function createPDFfromInvoice(content, path) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const chromiumPath = yield (0, get_paths_1.getBrowserBinaryPath)();
        if (chromiumPath.length < 1) {
            reject("no se a encontrado un navegador basado en chomium, por favor, instala uno");
            return;
        }
        const htmlRendering = yield generateHtmlFromInvoice(content);
        const browser = yield puppeteer_1.default.launch({ executablePath: chromiumPath });
        const page = yield browser.newPage();
        yield page.setContent(htmlRendering);
        yield page.emulateMediaType('screen');
        yield page.pdf({
            path: path,
            format: 'A4',
            printBackground: true
        });
        yield browser.close();
        resolve();
    }));
}
