#!/bin/bash

# Instala las dependencias específicas utilizando npm
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
            xlsx@0.18.5 \
	    edge-paths@3.0.5
