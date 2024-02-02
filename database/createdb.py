import sqlite3

# TABLAS = facturas (ingresos, gastos), presonas (clientes, provedores)

# facturas = (TEXT numero[A1], TEXT cliente[indice], TEXT proveedor[indice], DATE fecha[YYYY-MM-DD], TEXT unidades[JSON], REAL importeTotal, INTEGER IRPF[5], TEXT detalles, TEXT Actividad)

# unidades json = {"canitdad": "", "tipo": "", "precio unidad": "", "iva": "" }

# presonas = (TEXT nombre, TEXT id, TEXT direccion, TEXT contacto)

conexion = sqlite3.connect("main.db")

cursor = conexion.cursor()

#ingresos
cursor.execute('''CREATE TABLE IF NOT EXISTS facturas (
                    numero TEXT,
                    receptor TEXT,
                    emisor TEXT,
                    fecha DATE,
                    unidades TEXT,
                    concepto TEXT, 
                    importeTotal REAL,
                    irpf INTEGER,
                    detalles TEXT,
                    formaDePago TEXT
                  )''')

#clientes
cursor.execute('''CREATE TABLE IF NOT EXISTS receptor (
                    nombre TEXT,
                    id TEXT,
                    direccion TEXT,
                    contacto TEXT
                  )''')

#proveedores
cursor.execute('''CREATE TABLE IF NOT EXISTS emisor (
                    nombre TEXT,
                    id TEXT,
                    direccion TEXT,
                    contacto TEXT
                  )''')

conexion.commit()
conexion.close()
