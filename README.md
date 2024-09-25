# FACTURACION FACIL

Este repositorio contiene una aplicación para ayudar con la contabilidad de una empresa pequeña o mediana.

Esta desarrollada para Yolanda Muñoz del Aguila.

## Configuración del Repositorio

Primero asegurate de tener instalado nodejs y npm.

En linux ejecuta:

   ```bash
   sudo (tu-package-manager) npm nodejs 
   ```

Y en windows dirigete a su pagina y desde allí sigue las instrucciones.

Una vez hecho esto ejecuta `setup.bat` en windows y `setup.sh` en linux.

Si da algun error instala manualmente los paquetes de npm.

## Dependencias extras

Es necesario tener un navegador basado en chromium instalado, en windows con Edge es necesario, para linux instala chomium o un navegador similar.

Si no estas seguro de si tienes el navegado necesario. Utiliza la aplicación de forma normal y en el momento que sea requerido te saldrá una notificación si no tienes el navegador necesario. 

## Build

Para compilar el archivo ejecutable ejecuta:

   ```bash
   npm run make 
   ```

## Funcionamiento

En la aplicacion puedes crear facturas que se guradan en una base de datos, puedes gestionar la base de datos donde se guardan o crear una nueva.

Al crear una factura la exportas en .pdf, se puede configurar el css de dicho pdf.

Ya creadas las facturas se puede ir al libro de registro, dicho libro de registro se le pueden añadir filtro para los datos y se puede exportar como xlsx.

## Capturas de Pantalla

![Captura de pantalla de la aplicación](./screenshot.png) 

## Contacto

Si quieres ponerte en contacto conmigo envia un correo a:

> contacto@pedrofm.dev

O visita mi pagina web:

> pedrofm.dev
