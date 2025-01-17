import { ipcMain } from "electron";
import { openFileDialog } from "./infra/electron_specific_functions/file_dialog";
import { mainWindow } from "./main";
import { generateInvoiceFromUsrInput } from "./core/invoices/new_invoicen";
import { createPDFfromInvoice } from "./infra/manage_files/create_pdf";
import { openNewWindow } from "./infra/electron_specific_functions/open_window";
import { createSubjectData, getAllSubjectsData, getSubjectData } from "./infra/comunicate_db/manage_subject_data";
import { myAlert } from "./infra/electron_specific_functions/custom_alert";
import { payMethodsArray } from "./core/payMethod/payMethodsArray";

export function setupIPCListeners() {
    ipcMain.handle('openFileDialog', async (event, fileName: string, fileType: string) => {
        try {
            return await openFileDialog(fileName, fileType, mainWindow);
        } catch {
            throw new Error('Failed to open file dialog.');
        }
    });

    ipcMain.handle('myAlert', async (event, message: string) => {
        try {
            return myAlert(message);
        } catch {
            throw new Error('Failed to open alert.');
        }
    });

    ipcMain.handle('generateInvoiceFromUsrInput', async (event, letter: string, receiverName: string, emitterName: string, emisionDate: string, expirationDate: string, productsList: Product[], concept: string, irpf: number, details: string, payMethodName: string, extraPayMethodData: string) => {
        try {
            return await generateInvoiceFromUsrInput(letter, receiverName, emitterName, emisionDate, expirationDate, productsList, concept, irpf, details, payMethodName, extraPayMethodData);
        } catch {
            throw new Error('Error generating invoice: Faltan datos o error en la generación de la factura.');
        }
    });

    ipcMain.handle('createPDFfromInvoice', async (event, invoice: Invoice, path: string) => {
        try {
            return await createPDFfromInvoice(invoice, path);
        } catch {
            throw new Error('Failed to create PDF from invoice.');
        }
    });

    ipcMain.handle('openNewWindow', async (event, htmlPath: string, envVar?: string) => {
        try {
            return openNewWindow(htmlPath, envVar);
        } catch {
            throw new Error('Failed to open new window.');
        }
    });

    ipcMain.handle('getSubjectData', async (event, subjectName: string, table: string, database?: string) => {
        try {
            return await getSubjectData(subjectName, table, database);
        } catch {
            throw new Error('Failed to retrieve subject data.');
        }
    });

    ipcMain.handle('getAllSubjectsData', async (event, table: string, database?: string) => {
        try {
            return await getAllSubjectsData(table, database);
        } catch {
            throw new Error('Failed to retrieve all subjects data.');
        }
    });

    ipcMain.handle('createSubjectData', async (event, personType: PersonType, id: string, name: string, address: string, postCode: string, town: string, province: string, contact: string, dbTable: string, dbName: string = 'current') => {
        try {


            return await createSubjectData(personType, id, name, address, postCode, town, province, contact, dbName, dbTable);
        } catch (error) {
            throw new Error(`Failed to create subject data: ${error}`);
        }
    });
    
    ipcMain.handle('getPayMethodsArray', (event) => {
        try {
            return payMethodsArray;
        } catch (error) {
            throw new Error(`Failed to get pay method array: ${error}`);
        }
    });
}

