import path from 'path';
import { homedir } from 'os';
import fs from 'fs/promises'
import { createDB } from '../comunicate_db/manage_dbs';

import { image } from './image';

export async function createConfigFolder(): Promise<void> {
    return new Promise(async (resolve) => {
        const homeDir: string = homedir();
        const folderPath: string = path.join(homeDir, "./.facturacionfacil/");

        //Verificar si existe ya la carpeta
        try {
            await fs.access(folderPath);
            console.log(`La carpeta de configuración '${folderPath}' ya existe.`);
            resolve();
        } catch (error) {
            await fs.mkdir(folderPath);
            console.log(`Se ha creado la carpeta de configuración ${folderPath}`);
        }

        // Inicializar la base de datos
        createDB("ingresos");
        createDB("gastos");

        // Inicializar otros aspectos, como CSS
        initialiceCSS(folderPath);
        initializeSettings(folderPath);
        initializeBase64Image(folderPath);

        resolve();
    });
};

async function initialiceCSS(folderPath: string): Promise<void> {
    const filePath = path.join(folderPath, "style.css");

    try {
        // Verificar si el archivo ya tiene contenido
        const existingContent = await fs.readFile(filePath, 'utf-8');

        // Si el archivo ya tiene contenido, no hacemos nada
        if (existingContent.length > 0) {
            console.log(`El archivo CSS '${filePath}' ya tiene contenido.`);
            return;
        }
    } catch (error) {
        // Si ocurre un error al leer el archivo, es probable que aún no exista, así que continuamos
    }

    // Si el archivo no tiene contenido, lo escribimos
    const cssContent = `.body {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: lighter;
}

.header {
  line-height: 5%;
  overflow: hidden;
}

.header img {
  float: right;
  width: 300px;
  height: 100px;
}

.remitente {
  float: left;
}

.datos1 {
  overflow: hidden;
  line-height: 5%;
  padding-top: 15px;
}

.comprador {
  float: left;
}

.datos_id_factura {
  float: right;
}

#productos {
  width: 100%;
  border-collapse: collapse;   
  margin-top: 20px;
}

#productos td {
  border: 1px solid #000;
  padding: 5px;
  text-align: center;
}

#productos th {
   padding: 5px;
   background-color: black;
   color: white;
}

.pago_total {
  line-height: 5%;
}

.datos2 {
  padding-top: 20px;
}

.forma_pago {
  padding-top: 15px;
}`;

    await fs.writeFile(filePath, cssContent);
    console.log(`Archivo CSS '${filePath}' creado.`);
}

async function initializeSettings(folderPath: string): Promise<void> {
    const filePath = path.join(folderPath, ".settings.json");

    try {
        // Verificar si el archivo ya tiene contenido
        const existingContent = await fs.readFile(filePath, 'utf-8');

        // Si el archivo ya tiene contenido, no hacemos nada
        if (existingContent.length > 0) {
            console.log(`El archivo de configuración '${filePath}' ya tiene contenido.`);
            return;
        }
    } catch (error) {
        // Si ocurre un error al leer el archivo, es probable que aún no exista, así que continuamos
    }

    // Si el archivo no tiene contenido, lo escribimos
    const settingsContent = `{
    "current_database": "ingresos",
    "possible_db": [
      "ingresos", 
      "gastos"
    ]
  }`;

    await fs.writeFile(filePath, settingsContent);
    console.log(`Archivo de configuración '${filePath}' creado.`);
}

async function saveBase64ImageToFile(base64String: string, outputPath: string): Promise<void> {
    try {
        // Convertir la cadena base64 a datos binarios
        const imageBuffer: Buffer = Buffer.from(base64String, 'base64');

        // Escribir los datos del buffer en un archivo
        await fs.writeFile(outputPath, imageBuffer);

        console.log('Imagen guardada en:', outputPath);
    } catch (error) {
        console.error('Error al guardar la imagen:', error);
    }
}

async function initializeBase64Image(folderPath: string): Promise<void> {
    const outputPath = path.join(folderPath, 'logo.png');

    try {
        // Verificar si el archivo ya existe
        await fs.access(outputPath, fs.constants.F_OK);

        // Si el archivo ya existe, no hacemos nada
        console.log(`El archivo '${outputPath}' ya existe.`);
    } catch (error) {
        // Si hay un error al verificar la existencia del archivo, continuamos y lo creamos
        // Si el archivo no existe, lo escribimos
        await saveBase64ImageToFile(image.replace(/^data:image\/\w+;base64,/, ''), outputPath);
    }
}

