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
exports.createConfigFolder = createConfigFolder;
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const promises_1 = __importDefault(require("fs/promises"));
const manage_dbs_1 = require("../comunicate_db/manage_dbs");
const image_1 = require("./image");
function createConfigFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const homeDir = (0, os_1.homedir)();
            const folderPath = path_1.default.join(homeDir, "./.facturacionfacil/");
            //Verificar si existe ya la carpeta
            try {
                yield promises_1.default.access(folderPath);
                console.log(`La carpeta de configuración '${folderPath}' ya existe.`);
                resolve();
            }
            catch (error) {
                yield promises_1.default.mkdir(folderPath);
                console.log(`Se ha creado la carpeta de configuración ${folderPath}`);
            }
            // Inicializar la base de datos
            (0, manage_dbs_1.createDB)("ingresos");
            (0, manage_dbs_1.createDB)("gastos");
            // Inicializar otros aspectos, como CSS
            initialiceCSS(folderPath);
            initializeSettings(folderPath);
            initializeBase64Image(folderPath);
            resolve();
        }));
    });
}
;
function initialiceCSS(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(folderPath, "style.css");
        try {
            // Verificar si el archivo ya tiene contenido
            const existingContent = yield promises_1.default.readFile(filePath, 'utf-8');
            // Si el archivo ya tiene contenido, no hacemos nada
            if (existingContent.length > 0) {
                console.log(`El archivo CSS '${filePath}' ya tiene contenido.`);
                return;
            }
        }
        catch (error) {
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
        yield promises_1.default.writeFile(filePath, cssContent);
        console.log(`Archivo CSS '${filePath}' creado.`);
    });
}
function initializeSettings(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(folderPath, ".settings.json");
        try {
            // Verificar si el archivo ya tiene contenido
            const existingContent = yield promises_1.default.readFile(filePath, 'utf-8');
            // Si el archivo ya tiene contenido, no hacemos nada
            if (existingContent.length > 0) {
                console.log(`El archivo de configuración '${filePath}' ya tiene contenido.`);
                return;
            }
        }
        catch (error) {
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
        yield promises_1.default.writeFile(filePath, settingsContent);
        console.log(`Archivo de configuración '${filePath}' creado.`);
    });
}
function saveBase64ImageToFile(base64String, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Convertir la cadena base64 a datos binarios
            const imageBuffer = Buffer.from(base64String, 'base64');
            // Escribir los datos del buffer en un archivo
            yield promises_1.default.writeFile(outputPath, imageBuffer);
            console.log('Imagen guardada en:', outputPath);
        }
        catch (error) {
            console.error('Error al guardar la imagen:', error);
        }
    });
}
function initializeBase64Image(folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputPath = path_1.default.join(folderPath, 'logo.png');
        try {
            // Verificar si el archivo ya existe
            yield promises_1.default.access(outputPath, promises_1.default.constants.F_OK);
            // Si el archivo ya existe, no hacemos nada
            console.log(`El archivo '${outputPath}' ya existe.`);
        }
        catch (error) {
            // Si hay un error al verificar la existencia del archivo, continuamos y lo creamos
            // Si el archivo no existe, lo escribimos
            yield saveBase64ImageToFile(image_1.image.replace(/^data:image\/\w+;base64,/, ''), outputPath);
        }
    });
}
