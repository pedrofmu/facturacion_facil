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
exports.setupIPCListeners = setupIPCListeners;
const electron_1 = require("electron");
const file_dialog_1 = require("./infra/electron_specific_functions/file_dialog");
const main_1 = require("./main");
const new_invoicen_1 = require("./core/invoices/new_invoicen");
const create_pdf_1 = require("./infra/manage_files/create_pdf");
const open_window_1 = require("./infra/electron_specific_functions/open_window");
const manage_subject_data_1 = require("./infra/comunicate_db/manage_subject_data");
const manage_pay_methods_1 = require("./infra/comunicate_db/manage_pay_methods");
const custom_alert_1 = require("./infra/electron_specific_functions/custom_alert");
function setupIPCListeners() {
    electron_1.ipcMain.handle('openFileDialog', (event, fileName, fileType) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, file_dialog_1.openFileDialog)(fileName, fileType, main_1.mainWindow);
        }
        catch (_a) {
            throw new Error('Failed to open file dialog.');
        }
    }));
    electron_1.ipcMain.handle('myAlert', (event, message) => __awaiter(this, void 0, void 0, function* () {
        try {
            return (0, custom_alert_1.myAlert)(message);
        }
        catch (_a) {
            throw new Error('Failed to open alert.');
        }
    }));
    electron_1.ipcMain.handle('generateInvoiceFromUsrInput', (event, letter, receiverName, emitterName, emisionDate, expirationDate, productsList, concept, irpf, details, payMethodName, extraPayMethodData) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, new_invoicen_1.generateInvoiceFromUsrInput)(letter, receiverName, emitterName, emisionDate, expirationDate, productsList, concept, irpf, details, payMethodName, extraPayMethodData);
        }
        catch (_a) {
            throw new Error('Error generating invoice: Faltan datos o error en la generación de la factura.');
        }
    }));
    electron_1.ipcMain.handle('createPDFfromInvoice', (event, invoice, path) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, create_pdf_1.createPDFfromInvoice)(invoice, path);
        }
        catch (_a) {
            throw new Error('Failed to create PDF from invoice.');
        }
    }));
    electron_1.ipcMain.handle('openNewWindow', (event, htmlPath, envVar) => __awaiter(this, void 0, void 0, function* () {
        try {
            return (0, open_window_1.openNewWindow)(htmlPath, envVar);
        }
        catch (_a) {
            throw new Error('Failed to open new window.');
        }
    }));
    electron_1.ipcMain.handle('getSubjectData', (event, subjectName, table, database) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, manage_subject_data_1.getSubjectData)(subjectName, table, database);
        }
        catch (_a) {
            throw new Error('Failed to retrieve subject data.');
        }
    }));
    electron_1.ipcMain.handle('getAllSubjectsData', (event, table, database) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, manage_subject_data_1.getAllSubjectsData)(table, database);
        }
        catch (_a) {
            throw new Error('Failed to retrieve all subjects data.');
        }
    }));
    electron_1.ipcMain.handle('getPayMethodType', (event, payMethodName, database) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, manage_pay_methods_1.getPayMethodType)(payMethodName, database);
        }
        catch (_a) {
            throw new Error('Failed to retrieve payment method type.');
        }
    }));
    electron_1.ipcMain.handle('getAllPayMethodTypes', (event, database) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, manage_pay_methods_1.getAllPayMethodTypes)(database);
        }
        catch (_a) {
            throw new Error('Failed to retrieve all payment method types.');
        }
    }));
    electron_1.ipcMain.handle('createPayMethod', (event_1, payMethodName_1, hasExtraData_1, ...args_1) => __awaiter(this, [event_1, payMethodName_1, hasExtraData_1, ...args_1], void 0, function* (event, payMethodName, hasExtraData, database = 'current') {
        try {
            return yield (0, manage_pay_methods_1.createPayMethod)(database, payMethodName, hasExtraData);
        }
        catch (_a) {
            throw new Error('Failed to create pay method');
        }
    }));
    electron_1.ipcMain.handle('createSubjectData', (event_1, taxIdentificationName_1, personTypeValue_1, id_1, name_1, address_1, postCode_1, town_1, province_1, contact_1, dbTable_1, ...args_1) => __awaiter(this, [event_1, taxIdentificationName_1, personTypeValue_1, id_1, name_1, address_1, postCode_1, town_1, province_1, contact_1, dbTable_1, ...args_1], void 0, function* (event, taxIdentificationName, personTypeValue, id, name, address, postCode, town, province, contact, dbTable, dbName = 'current') {
        try {
            let personTypeEnum;
            switch (personTypeValue) {
                case 'F':
                    personTypeEnum = "F" /* PersonType.F */;
                    break;
                case 'L':
                    personTypeEnum = "L" /* PersonType.L */;
                    break;
                default:
                    throw new Error("Incorrect value in person type enum");
            }
            console.warn(personTypeEnum);
            return yield (0, manage_subject_data_1.createSubjectData)(taxIdentificationName, personTypeEnum, id, name, address, postCode, town, province, contact, dbTable, dbName);
        }
        catch (error) {
            throw new Error(`Failed to create subject data: ${error}`);
        }
    }));
}
