"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const arg = process.argv.find(arg => arg.startsWith('--envVar='));
let envVar = "null";
if (arg)
    envVar = arg.split('=')[1];
const api = {
    openFileDialog: (fileName, fileType) => electron_1.ipcRenderer.invoke('openFileDialog', fileName, fileType),
    myAlert: (message) => electron_1.ipcRenderer.invoke('myAlert', message),
    generateInvoiceFromUsrInput: (letter, receiverName, emitterName, emisionDate, expirationDate, productsList, concept, irpf, details, payMethodName, extraPayMethodData) => electron_1.ipcRenderer.invoke('generateInvoiceFromUsrInput', letter, receiverName, emitterName, emisionDate, expirationDate, productsList, concept, irpf, details, payMethodName, extraPayMethodData),
    createPDFfromInvoice: (invoice, path) => electron_1.ipcRenderer.invoke('createPDFfromInvoice', invoice, path),
    openNewWindow: (htmlPath, envVar) => electron_1.ipcRenderer.invoke('openNewWindow', htmlPath, envVar),
    getSubjectData: (subjectName, table, database) => electron_1.ipcRenderer.invoke('getSubjectData', subjectName, table, database),
    getAllSubjectsData: (table, database) => electron_1.ipcRenderer.invoke('getAllSubjectsData', table, database),
    getPayMethodType: (payMethodName, database) => electron_1.ipcRenderer.invoke('getPayMethodType', payMethodName, database),
    getAllPayMethodTypes: (database) => electron_1.ipcRenderer.invoke('getAllPayMethodTypes', database),
    getEnvVar: () => { return envVar; },
    createPayMethod: (payMethodName, hasExtraType, database) => electron_1.ipcRenderer.invoke('createPayMethod', payMethodName, hasExtraType, database),
    createSubjectData: (taxIdentificationName, personType, id, name, address, postCode, town, province, contact, dbTable, dbName) => electron_1.ipcRenderer.invoke('createSubjectData', taxIdentificationName, personType, id, name, address, postCode, town, province, contact, dbTable, dbName),
};
electron_1.contextBridge.exposeInMainWorld("electronAPI", api);
