import sqlite3

# TABLAS = facturas (ingresos, gastos), presonas (clientes, provedores)

# facturas = (TEXT numero[A1], TEXT cliente[indice], TEXT proveedor[indice], DATE fecha[YYYY-MM-DD], TEXT unidades[JSON], REAL importeTotal, INTEGER IRPF[5], TEXT detalles, TEXT Actividad)

# unidades json = {"canitdad": "", "tipo": "", "precio unidad": "", "iva": "" }

# presonas = (TEXT nombre, TEXT id, TEXT direccion, TEXT contacto)

conexion = sqlite3.connect("main.db")

cursor = conexion.cursor()

#ingresos
cursor.execute('''CREATE TABLE IF NOT EXISTS ingresos (
                    numero TEXT,
                    cliente TEXT,
                    proveedor TEXT,
                    fecha DATE,
                    unidades TEXT,
                    importeTotal REAL,
                    irpf INTEGER,
                    detalles TEXT,
                    actividad TEXT
                  )''')

#gastos
cursor.execute('''CREATE TABLE IF NOT EXISTS gastos (
                    numero TEXT,
                    cliente TEXT,                         
                    proveedor TEXT,
                    fecha DATE,
                    unidades TEXT,
                    importeTotal REAL,
                    irpf INTEGER,
                    detalles TEXT,
                    actividad TEXT
                  )''')

#clientes
cursor.execute('''CREATE TABLE IF NOT EXISTS clientes (
                    nombre TEXT,
                    id TEXT,
                    direccion TEXT,
                    contacto TEXT
                  )''')

#proveedores
cursor.execute('''CREATE TABLE IF NOT EXISTS proveedores (
                    nombre TEXT,
                    id TEXT,
                    direccion TEXT,
                    contacto TEXT
                  )''')

conexion.commit()
conexion.close()
