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

    generateInvoiceFromUsrInput: (letter: string, receiverName: string, emitterName: string, emisionDate: string, expirationDate: string, productsList: product[], concept: string, irpf: number, details: string, payMethodName: string, extraPayMethodData: string) => Promise<invoice>;

    createPDFfromInvoice: (invoice: invoice, path: string) => Promise<void>;

    openNewWindow: (htmlPath: string, envVar?: string) => void;

    getSubjectData: (subjectName: string, table: string, database?: string) => Promise<subject>;
    getAllSubjectsData: (table: string, database?: string) => Promise<subject[]>;

    getPayMethodType: (payMethodName: string, database?: string) => Promise<payMethodType>;

    getAllPayMethodTypes: (database?: string) => Promise<payMethodType[]>;

    getEnvVar: () => string;

    createPayMethod: (payMethodName: string, hasExtraType: boolean, database?: string) => Promise<void>;

    createSubjectData: (taxIdentificationName: string, personType: string, id: string, name: string, address: string, postCode: string, town: string, province: string, contact: string, dbTable: string, dbName?: string) => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

const api: ElectronAPI = {
    openFileDialog: (fileName: string, fileType: string) => ipcRenderer.invoke('openFileDialog', fileName, fileType),

    myAlert: (message: string) => ipcRenderer.invoke('myAlert', message),

    generateInvoiceFromUsrInput: (letter: string, receiverName: string, emitterName: string, emisionDate: string, expirationDate: string, productsList: product[], concept: string, irpf: number, details: string, payMethodName: string, extraPayMethodData: string) => ipcRenderer.invoke('generateInvoiceFromUsrInput', letter, receiverName, emitterName, emisionDate, expirationDate, productsList, concept, irpf, details, payMethodName, extraPayMethodData),

    createPDFfromInvoice: (invoice: invoice, path: string) => ipcRenderer.invoke('createPDFfromInvoice', invoice, path),

    openNewWindow: (htmlPath: string, envVar?: string) => ipcRenderer.invoke('openNewWindow', htmlPath, envVar),

    getSubjectData: (subjectName: string, table: string, database?: string) => ipcRenderer.invoke('getSubjectData', subjectName, table, database),

    getAllSubjectsData: (table: string, database?: string) => ipcRenderer.invoke('getAllSubjectsData', table, database),

    getPayMethodType: (payMethodName: string, database?: string) => ipcRenderer.invoke('getPayMethodType', payMethodName, database),

    getAllPayMethodTypes: (database?: string) => ipcRenderer.invoke('getAllPayMethodTypes', database),

    getEnvVar: () => { return envVar; },

    createPayMethod: (payMethodName: string, hasExtraType: boolean, database?: string) => ipcRenderer.invoke('createPayMethod', payMethodName, hasExtraType, database),

    createSubjectData: (taxIdentificationName: string, personType: string, id: string, name: string, address: string, postCode: string, town: string, province: string, contact: string, dbTable: string, dbName?: string) => 


    ipcRenderer.invoke('createSubjectData', taxIdentificationName, personType, id, name, address, postCode, town, province, contact, dbTable, dbName),
}

contextBridge.exposeInMainWorld("electronAPI", api)
