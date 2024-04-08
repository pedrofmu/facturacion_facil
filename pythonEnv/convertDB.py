import sqlite3

# Conexión a la base de datos anterior
old_db_conn = sqlite3.connect('ruta_a_tu_base_de_datos_anterior.db')
old_cursor = old_db_conn.cursor()

# Conexión a la nueva base de datos
new_db_conn = sqlite3.connect('ruta_a_tu_nueva_base_de_datos.db')
new_cursor = new_db_conn.cursor()

# Migrar datos de la tabla facturas
old_cursor.execute('SELECT * FROM facturas')
facturas = old_cursor.fetchall()
for factura in facturas:
    # Obtener los valores de la factura
    numero, receptor, emisor, fechaEmision, unidades, concepto, importeTotal, irpf, detalles = factura

    # Insertar los datos en la nueva tabla facturas
    new_cursor.execute('INSERT INTO facturas (numero, receptor, emisor, fechaEmision, unidades, concepto, importeTotal, irpf, detalles, formaDePago) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                       (numero, receptor, emisor, fechaEmision, unidades, concepto, importeTotal, irpf, detalles, ''))

# Migrar datos de la tabla receptor
old_cursor.execute('SELECT * FROM receptor')
receptores = old_cursor.fetchall()
for receptor in receptores:
    # Insertar los datos en la nueva tabla receptor
    new_cursor.execute('INSERT INTO receptor (nombre, id, direccion, contacto) VALUES (?, ?, ?, ?)',
                       receptor)

# Migrar datos de la tabla emisor
old_cursor.execute('SELECT * FROM emisor')
emisores = old_cursor.fetchall()
for emisor in emisores:
    # Insertar los datos en la nueva tabla emisor
    new_cursor.execute('INSERT INTO emisor (nombre, id, direccion, contacto) VALUES (?, ?, ?, ?)',
                       emisor)

# Guardar los cambios y cerrar conexiones
new_db_conn.commit()
old_db_conn.close()
new_db_conn.close()
