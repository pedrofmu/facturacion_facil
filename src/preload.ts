import { contextBridge, ipcRenderer } from "electron";

const arg = process.argv.find(arg => arg.startsWith('--envVar='));
let envVar = "null";

if (arg)
    envVar = arg.split('=')[1];

// COMO EXPONER FUNCIONES A LA API:
// Declarla en la infraestructura de ElectronAPI
// implementarla en api llamando al ipcRender
// implementar el ipc que llame directamente a la funcion (setup_ip.ts)

export interface ElectronAPI {
    openFileDialog: (fileName: string, fileType: string) => Promise<any>;

    myAlert: (message: string) => void;

    generateInvoiceFromUsrInput: (letter: string, receiverName: string, emitterName: string, emisionDate: string, expirationDate: string, productsList: Product[], concept: string, irpf: number, details: string, payMethodName: string, extraPayMethodData: string) => Promise<Invoice>;

    createPDFfromInvoice: (invoice: Invoice, path: string) => Promise<void>;

    openNewWindow: (htmlPath: string, envVar?: string) => void;

    getSubjectData: (subjectName: string, table: string, database?: string) => Promise<Subject>;
    getAllSubjectsData: (table: string, database?: string) => Promise<Subject[]>;

    getEnvVar: () => string;

    createPayMethod: (payMethodName: string, hasExtraType: string, database?: string) => Promise<void>;

    createSubjectData: (personType: PersonType, id: string, name: string, address: string, postCode: string, town: string, province: string, contact: string, dbTable: string, dbName?: string) => Promise<void>;

    getPayMethodsArray: () => Promise<[string, string]>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

const api: ElectronAPI = {
    openFileDialog: (fileName: string, fileType: string) => ipcRenderer.invoke('openFileDialog', fileName, fileType),

    myAlert: (message: string) => ipcRenderer.invoke('myAlert', message),

    generateInvoiceFromUsrInput: (letter: string, receiverName: string, emitterName: string, emisionDate: string, expirationDate: string, productsList: Product[], concept: string, irpf: number, details: string, payMethodName: string, extraPayMethodData: string) => ipcRenderer.invoke('generateInvoiceFromUsrInput', letter, receiverName, emitterName, emisionDate, expirationDate, productsList, concept, irpf, details, payMethodName, extraPayMethodData),

    createPDFfromInvoice: (invoice: Invoice, path: string) => ipcRenderer.invoke('createPDFfromInvoice', invoice, path),

    openNewWindow: (htmlPath: string, envVar?: string) => ipcRenderer.invoke('openNewWindow', htmlPath, envVar),

    getSubjectData: (subjectName: string, table: string, database?: string) => ipcRenderer.invoke('getSubjectData', subjectName, table, database),

    getAllSubjectsData: (table: string, database?: string) => ipcRenderer.invoke('getAllSubjectsData', table, database),

    getEnvVar: () => { return envVar; },

    createPayMethod: (payMethodName: string, hasExtraType: string, database?: string) => ipcRenderer.invoke('createPayMethod', payMethodName, hasExtraType, database),

    createSubjectData: (personType: PersonType, id: string, name: string, address: string, postCode: string, town: string, province: string, contact: string, dbTable: string, dbName?: string) => ipcRenderer.invoke('createSubjectData', personType, id, name, address, postCode, town, province, contact, dbTable, dbName),

    getPayMethodsArray: () => ipcRenderer.invoke('getPayMethodsArray'),
}

contextBridge.exposeInMainWorld("electronAPI", api)
