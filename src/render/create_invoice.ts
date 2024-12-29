const emisionDateInput = document.getElementById("fecha_emision_input") as HTMLInputElement;
const expirationDateInput = document.getElementById("fecha_vencimiento_input") as HTMLInputElement;
const letterSelector = document.getElementById("letra_selector") as HTMLSelectElement;
const irpfInput = document.getElementById("irpf") as HTMLInputElement;
const detailInput = document.getElementById("datos_extras") as HTMLInputElement;
const emitterSelector = document.getElementById("proveedor_selector") as HTMLSelectElement;
const receiverSelector = document.getElementById("cliente_selector") as HTMLSelectElement;
const conceptInput = document.getElementById("concepto") as HTMLInputElement;
const payMethodSelect = document.getElementById("forma_de_pago") as HTMLSelectElement;
const extraPayMethod = document.getElementById("extra_pay_method_entryes") as HTMLUListElement;

var discountPerProduct = false;

//Manejar el click de crear un cliente nuevo
document.getElementById("nuevo_cliente_btn")?.addEventListener("click", () => {
    window.electronAPI.openNewWindow("create_subject/create_subject.html", "receptor");
});

//Maneje el click de crear un proveedor nuevo
document.getElementById("nuevo_provedor_btn")?.addEventListener("click", () => {
    window.electronAPI.openNewWindow("create_subject/create_subject.html", "emisor");
});

//Abrir ventana de crear nuevo metodo de pago
document.getElementById("new_pay_method")?.addEventListener("click", () => {
    window.electronAPI.openNewWindow("create_pay_method/create_pay_method.html");
});

// Manejar clic en el botón de guardar factura
document.getElementById("guardar_btn")?.addEventListener("click", async () => {
    try {
        await triggerSaveInvoice();
        window.electronAPI.myAlert("Se a guardado la factura");
    } catch (error) {
        window.electronAPI.myAlert(`${error}`);
    }
});

// Manejar clic en el botón de añadir nueva unidad
document.getElementById("add_unidad_btn")?.addEventListener("click", () => {
    newProduct();
});

// Manejar eliminnar una unidad
document.getElementById("remove_unidad_btn")?.addEventListener("click", () => {
    var unitsContainer = document.getElementById("unidades_container");
    var lastProduct = unitsContainer?.lastElementChild;

    if (lastProduct) {
        unitsContainer?.removeChild(lastProduct);
    }
});

// Cambiar el tipo de descuento
document.getElementById("descuento_unidad_btn")?.addEventListener("click", () => {
    changeDiscountPerProduct();
});

// Ir atras
document.getElementById("atras_btn")?.addEventListener("click", () => {
    window.location.href = "../home/home.html"
});


payMethodSelect?.addEventListener("change", async () => {
    try {
        await showExtraPayMethod();
    } catch (error) {
        alert(error);
    }
});

payMethodSelect?.addEventListener("focus", () => {
    loadPayMethods();
});

receiverSelector?.addEventListener("focus", () => {
    loadPersons();
});

emitterSelector?.addEventListener("focus", () => {
    loadPersons();
});

async function triggerSaveInvoice(): Promise<void> {
    return new Promise(async (resolve, reject) => {
        let unitElements = document.querySelectorAll(".unidades");
        let productsList: product[] = [];

        unitElements.forEach((element) => {
            // Obtener los valores de los inputs dentro de cada li
            let cuantity: number = Number((element.querySelector('input:nth-child(1)') as HTMLInputElement).value);
            let type: string = (element.querySelector('input:nth-child(2)') as HTMLInputElement).value;
            let priceUnit: number = Number((element.querySelector('input:nth-child(3)') as HTMLInputElement).value);
            let iva: number = Number((element.querySelector('input:nth-child(4)') as HTMLInputElement).value);
            let discount: number = 0;
            if (discountPerProduct) {
                discount = Number((element.querySelector('input:nth-child(5)') as HTMLInputElement).value);
            } else {
                discount = Number((document.getElementById("descuento_al_total") as HTMLInputElement).value);
            }

            // Crear un objeto con los datos y agregarlo a la lista
            let productData: product = {
                cuantity: cuantity,
                type: type,
                priceUnit: priceUnit,
                iva: iva,
                discount: discount
            };

            productsList.push(productData);
        });

        let payMethodEntryes = document.querySelectorAll(".pay_method_entry");
        let extraDataPayMethodParsed: string = "";

        payMethodEntryes.forEach((entry) => {
            extraDataPayMethodParsed += `,${(entry.querySelector('input:nth-child(1)') as HTMLInputElement).value}`;
        });

        console.log(extraDataPayMethodParsed);

        let invoice: invoice;
        try {
            invoice = await window.electronAPI.generateInvoiceFromUsrInput(letterSelector.value, receiverSelector.value, emitterSelector.value, emisionDateInput.value, expirationDateInput.value, productsList, conceptInput.value, Number(irpfInput.value), detailInput.value, payMethodSelect.value, extraDataPayMethodParsed);

        } catch {
            reject("faltan valores");
            return;
        }

        let pdfPath: any;
        try {
            pdfPath = await window.electronAPI.openFileDialog(invoice.number, 'pdf');
        } catch {
            reject("selecciona un path valido");
        }

        if (pdfPath.filePath === '') {
            reject("selecciona un path valido");
        }

        try {
            await window.electronAPI.createPDFfromInvoice(invoice, pdfPath.filePath);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function changeDiscountPerProduct() {
    discountPerProduct = !discountPerProduct;

    if (discountPerProduct) {
        var unitElements = document.querySelectorAll(".unidades");

        unitElements.forEach((element) => {
            var newInput = document.createElement("input");
            newInput.type = "number";
            newInput.placeholder = "descuento";
            newInput.id = "descuento";
            newInput.className = "input";

            element.appendChild(newInput);
        });

        var descuentoTotal = document.getElementById("descuento_al_total") as HTMLInputElement;
        descuentoTotal.classList.add("oculto");

        var descuentoTotalLabel = document.getElementById("des_lbl") as HTMLLabelElement;
        descuentoTotalLabel.classList.add("oculto");

        (document.getElementById("descuento_unidad_btn") as HTMLButtonElement).innerHTML = "Descuento al total";
    } else {
        var unitElements = document.querySelectorAll(".unidades");

        unitElements.forEach((element) => {
            var descToDelete = element.querySelector("#descuento") as HTMLInputElement;
            descToDelete.remove();
        });

        var descuentoTotal = document.getElementById("descuento_al_total") as HTMLInputElement;
        descuentoTotal.classList.remove("oculto");

        var descuentoTotalLabel = document.getElementById("des_lbl") as HTMLLabelElement;
        descuentoTotalLabel.classList.remove("oculto");


        (document.getElementById("descuento_unidad_btn") as HTMLLabelElement).innerHTML = "Descuento por unidad";
    }
}


//Añade un nuevo producto
function newProduct() {
    var unitsContainer = document.getElementById("unidades_container") as HTMLOListElement;

    var newProduct = document.createElement("li");
    newProduct.className = "unidades";

    for (var i = 0; i < 4; i++) {
        var newInput = document.createElement("input");
        newInput.type = i === 0 || i === 2 || i === 3 ? "number" : "text";
        newInput.placeholder = i === 0 ? "cantidad" : (i === 1 ? "tipo" : (i === 2 ? "precio unidad" : "iva"));
        newInput.className = "input";

        // Agregar el input al li
        newProduct.appendChild(newInput);
    }

    if (discountPerProduct) {
        var newInput = document.createElement("input");
        newInput.type = "number";
        newInput.placeholder = "descuento";
        newInput.id = "descuento";
        newInput.className = "input";

        // Agregar el input al li
        newProduct.appendChild(newInput);
    }

    unitsContainer.appendChild(newProduct);
}

// Función para cargar las letras del abecedario en el selector
function loadLetters() {
    for (var letterCode = 65; letterCode <= 90; letterCode++) {
        var option = document.createElement("option");
        option.value = String.fromCharCode(letterCode);
        option.text = String.fromCharCode(letterCode);
        letterSelector.add(option);
    }
}

// Función asincrónica para cargar las personas en los selectores
async function loadPersons() {
    // Función para obtener el nombre formateado
    const formatName = (name: string): string => {
        const parts = name.split(",");
        return `${parts[0] ?? ''} ${parts[1] ?? ''} ${parts[2] ?? ''}`.trim();
    };

    // Función para cargar opciones en el selector
    const loadOptions = async (selector: HTMLSelectElement, type: "receptor" | "emisor") => {
        // Obtener las opciones actuales del selector
        const existingOptions = new Set(Array.from(selector.options).map(option => option.text));

        // Cargar datos
        const subjectsList: subject[] = await window.electronAPI.getAllSubjectsData(type);

        // Agregar nuevas opciones
        subjectsList.forEach((row: subject) => {
            const name = formatName(row.name);
            const optionText = `${name} (${row.id})`;
            if (!existingOptions.has(optionText)) {
                const option = document.createElement("option");
                option.value = row.id;
                option.text = optionText;
                selector.add(option);
                existingOptions.add(optionText);
            }
        });
    };

    // Cargar datos para ambos selectores
    await loadOptions(receiverSelector, "receptor");
    await loadOptions(emitterSelector, "emisor");
}

async function loadPayMethods() {
    let payMethodsOptions = Array.from(payMethodSelect.options).map(option => option.value);

    const payMethodsArray = await window.electronAPI.getPayMethodsArray();
    payMethodsArray.forEach((row: any) => {
        if (!payMethodsOptions.includes(row)) {
            var option = document.createElement("option");
            option.value = row;
            option.text = row;
            payMethodSelect.add(option);
            payMethodsOptions.push(row);
        }
    });

    await showExtraPayMethod();
}

async function showExtraPayMethod() {
    const field = payMethodSelect.value;
    console.log(field);
    let allExtraData: string[] = [];

    switch (field) {
        case 'efectivo':
            allExtraData = [];
            break;
        case 'transferencia bancaria':
            allExtraData = ["iban", "fecha limite"];
            break;
        default:
            break;
    }

    extraPayMethod.innerHTML = '';
    for (let i = 0; i < allExtraData.length; i++) {
        if (allExtraData[i] == '')
            continue;
        //<input id="forma_de_pago_extra" type="text" class="input" name="forma_de_pago_extra" value="">

        var newEntry = document.createElement("li");
        newEntry.className = "pay_method_entry";

        var newInput = document.createElement("input");
        newInput.type = "text";
        newInput.placeholder = allExtraData[i];
        newInput.className = "input";

        // Agregar el input al li
        newEntry.appendChild(newInput);

        extraPayMethod.appendChild(newEntry);
    }
}

// Llamar a las funciones de carga al cargar la página
loadPayMethods();
loadLetters();
loadPersons();
newProduct();
