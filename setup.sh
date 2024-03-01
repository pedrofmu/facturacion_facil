#!/bin/bash

# Comprobar la versión de Node.js
NODE_VERSION=$(node -v)
REQUIRED_NODE_VERSION="v16.4.0"

# Función para comparar versiones de Node.js
compare_versions() {
    REQUIRED_VERSION=$(echo -e "$REQUIRED_NODE_VERSION\n$NODE_VERSION" | sort -V | head -n1)
    if [[ "$REQUIRED_VERSION" != "$REQUIRED_NODE_VERSION" ]]; then
        echo "Error: La versión de Node.js $NODE_VERSION no cumple con los requisitos mínimos ($REQUIRED_NODE_VERSION)"
        exit 1
    fi
}

# Comprobar si node está instalado
if ! command -v node &> /dev/null; then
    echo "Error: Node.js no está instalado"
    exit 1
fi

# Comprobar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "Error: npm no está instalado"
    exit 1
fi

# Comprobar la versión de Node.js
compare_versions

# Instalar las dependencias específicas utilizando npm
npm install @electron-forge/cli@7.2.0 \
            @electron-forge/maker-deb@7.2.0 \
            @electron-forge/maker-rpm@7.2.0 \
            @electron-forge/maker-squirrel@7.2.0 \
            @electron-forge/maker-zip@7.2.0 \
            @electron-forge/plugin-auto-unpack-natives@7.2.0 \
            chrome-launcher@1.1.0 \
            electron-squirrel-startup@1.0.0 \
            electron@28.2.3 \
            puppeteer@22.1.0 \
            sqlite3@5.1.7 \
            edge-paths@3.0.5 \
	    exceljs@4.4.0
