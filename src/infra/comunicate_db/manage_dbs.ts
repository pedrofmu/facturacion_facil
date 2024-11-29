import { getHomeFolderPath } from "../manage_env/get_paths";
import path from 'path';
import fs from 'fs/promises'
import sqlite3, { Database } from 'sqlite3'
import { createPayMethod } from "../comunicate_db/manage_pay_methods";
import { addPossibleDB } from "../manage_env/adm_settings";

export function createDB(nombre: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            //path a el home
            const homePath: string = await getHomeFolderPath();
            const dbPath: string = path.join(homePath, `${nombre}.db`);
            try {
                // Verificar si el archivo de base de datos ya existe
                await fs.access(dbPath);
                resolve(`El archivo de base de datos '${dbPath}' ya existe.`);
            } catch (error) {
                // Si no existe, crear el archivo vacío
                await fs.writeFile(dbPath, '');
            }

            // Conexión a la base de datos
            const db: Database = new sqlite3.Database(dbPath);

            // Crear las tablas si no existen
            const createFacturasTable = (): Promise<void> => {
                return new Promise((resolve, reject) => {
                    db.run(`CREATE TABLE IF NOT EXISTS facturas (
            numero TEXT,
            receptor TEXT,
            emisor TEXT,
            fechaEmision DATE,
            fechaVencimiento DATE,
            unidades TEXT,
            concepto TEXT, 
            importeTotal REAL,
            irpf INTEGER,
            detalles TEXT,
            formaDePago TEXT
          )`, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            };

            // Promesa para crear tabla receptor
            const createReceptorTable = (): Promise<void> => {
                return new Promise((resolve, reject) => {
                    db.run(`CREATE TABLE IF NOT EXISTS receptor (
            taxIdentificationName TEXT,
            personType TEXT,
            id TEXT,
            name TEXT,
            address TEXT,
            postCode TEXT,
            town TEXT,
            province TEXT,
            contact TEXT
          )`, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            };

            // Promesa para crear tabla emisor
            const createEmisorTable = (): Promise<void> => {
                return new Promise((resolve, reject) => {
                    db.run(`CREATE TABLE IF NOT EXISTS emisor (
            taxIdentificationName TEXT,
            personType TEXT,
            id TEXT,
            name TEXT,
            address TEXT,
            postCode TEXT,
            town TEXT,
            province TEXT,
            contact TEXT          
            )`, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            };

            // Promesa para crear tabla formasDePago
            const createFormasDePagoTable = (): Promise<void> => {
                return new Promise((resolve, reject) => {
                    db.run(`CREATE TABLE IF NOT EXISTS formasDePago (
            type TEXT,
            extraData BOOL
          )`, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            };

            // Esperar a que se completen todas las creaciones de tablas
            await Promise.all([
                createFacturasTable(),
                createReceptorTable(),
                createEmisorTable(),
                createFormasDePagoTable()
            ]);

            createPayMethod(nombre, "efectivo", false);

            await addPossibleDB(nombre);

            // Cerrar la conexión a la base de datos después de asegurarse de que se hayan creado las tablas
            db.close((err) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve('Conexión cerrada exitosamente');
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
