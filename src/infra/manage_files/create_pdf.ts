import { obtainIvaQuotasAsync, obtainIVAToAddAsync, obtainTaxableIncomeAsync } from "../../core/invoices/calculate_data";
import { getBrowserBinaryPath, getCSSPath, getImagePathAsync } from "../manage_env/get_paths";
import puppeteer from 'puppeteer';
import { readFile } from 'fs';
import { promisify } from 'util';

const readFileAsync: (path: string, options?: any) => Promise<Buffer> = promisify(readFile);

function createHTMLforProducts(productsList: product[]): Promise<string> {
    return new Promise((resolve) => {
        var htmlString: string = "";
        productsList.forEach((product: product) => {
            const cuantity: number = product.cuantity;
            const priceUnit: number = product.priceUnit;
            const iva: number = product.iva;

            const discount: number = cuantity * priceUnit * (product.discount / 100);
            const taxableIncome: number = (cuantity * priceUnit) - discount;

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

async function generateHtmlFromInvoice(invoice: Invoice): Promise<string> {
    return new Promise(async (resolve) => {
        const cssRendering = await readFileAsync(getCSSPath(), 'utf-8');

        const taxableIncome: number = await obtainTaxableIncomeAsync(invoice.products);
        const ivaToAdd: number = await obtainIVAToAddAsync(invoice.products);
        const ivasQuota: string[] = await obtainIvaQuotasAsync(invoice.products);

        const imgPath = await getImagePathAsync();

        const imageData = await readFileAsync(imgPath);
        const imageB64 = imageData.toString('base64');

        const productsHtml: string = await createHTMLforProducts(invoice.products);

        let restIRPF: number = 0;
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
              <h4><b>${invoice.emitter.name.replace(",", " ")}</b></h4>
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
    });
}

export function createPDFfromInvoice(content: Invoice, path: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const chromiumPath: string = await getBrowserBinaryPath();
        if (chromiumPath.length < 1) {
            reject("no se a encontrado un navegador basado en chomium, por favor, instala uno");
            return;
        }

        const htmlRendering: string = await generateHtmlFromInvoice(content);
        const browser = await puppeteer.launch({ executablePath: chromiumPath });
        const page = await browser.newPage();

        await page.setContent(htmlRendering);
        await page.emulateMediaType('screen');
        await page.pdf({
            path: path,
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        resolve();
    });
}
