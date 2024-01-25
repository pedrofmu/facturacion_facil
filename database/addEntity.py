import argparse
import sqlite3

def main():
    # Crear un objeto ArgumentParser
    parser = argparse.ArgumentParser(description='Descripción de tu script')

    # Agregar un argumento
    parser.add_argument('--clientes', help='Ruta al archivo JSON de clientes')
    parser.add_argument('--proovedores', help='Ruta al archivo JSON de proovedores')
    parser.add_argument('--ingresos', help='Ruta al archivo JSON de ingresos')
    parser.add_argument('--gastos', help='Ruta al archivo JSON de gastos')

    # Parsear los argumentos de la línea de comandos
    args = parser.parse_args()

# Acceder a clientes 
    if args.clientes:
        ruta_json = args.clientes
        conexion = sqlite3.connect("main.db")
        
        cursor = conexion.cursor()
        cursor.execute('''ISERT INTO clientes  VALUES(
                    nombre TEXT,
                    id TEXT,
                    direccion TEXT,
                    contacto TEXT
                  )''')
        conexion.commit()
        conexion.close()

# Acceder a proovedores
    elif args.proovedores:
        ruta_json = args.proovedores

# Acceder a ingresos
    elif args.ingresos:
        ruta_json = args.ingresos

# Acceder a gastos
    elif args.gastos:
        ruta_json = args.gastos

if __name__ == "__main__":
    main()
