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
var _a, _b, _c, _d, _e, _f, _g, _h;
const emisionDateInput = document.getElementById("fecha_emision_input");
const expirationDateInput = document.getElementById("fecha_vencimiento_input");
const letterSelector = document.getElementById("letra_selector");
const irpfInput = document.getElementById("irpf");
const detailInput = document.getElementById("datos_extras");
const emitterSelector = document.getElementById("proveedor_selector");
const receiverSelector = document.getElementById("cliente_selector");
const conceptInput = document.getElementById("concepto");
const payMethodSelect = document.getElementById("forma_de_pago");
const extraPayMethod = document.getElementById("forma_de_pago_extra");
var discountPerProduct = false;
//Manejar el click de crear un cliente nuevo
(_a = document.getElementById("nuevo_cliente_btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.electronAPI.openNewWindow("create_subject/create_subject.html", "receptor");
});
//Maneje el click de crear un proveedor nuevo
(_b = document.getElementById("nuevo_provedor_btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    window.electronAPI.openNewWindow("create_subject/create_subject.html", "emisor");
});
//Abrir ventana de crear nuevo metodo de pago
(_c = document.getElementById("new_pay_method")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    window.electronAPI.openNewWindow("create_pay_method/create_pay_method.html");
});
// Manejar clic en el botón de guardar factura
(_d = document.getElementById("guardar_btn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield triggerSaveInvoice();
        window.electronAPI.myAlert("Se a guardado la factura");
    }
    catch (error) {
        window.electronAPI.myAlert(`${error}`);
    }
}));
// Manejar clic en el botón de añadir nueva unidad
(_e = document.getElementById("add_unidad_btn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
    newProduct();
});
// Manejar eliminnar una unidad
(_f = document.getElementById("remove_unidad_btn")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
    var unitsContainer = document.getElementById("unidades_container");
    var lastProduct = unitsContainer === null || unitsContainer === void 0 ? void 0 : unitsContainer.lastElementChild;
    if (lastProduct) {
        unitsContainer === null || unitsContainer === void 0 ? void 0 : unitsContainer.removeChild(lastProduct);
    }
});
// Cambiar el tipo de descuento
(_g = document.getElementById("descuento_unidad_btn")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", () => {
    changeDiscountPerProduct();
});
// Ir atras
(_h = document.getElementById("atras_btn")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", () => {
    window.location.href = "../home/home.html";
});
payMethodSelect === null || payMethodSelect === void 0 ? void 0 : payMethodSelect.addEventListener("change", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield showExtraPayMethod();
    }
    catch (error) {
        alert(error);
    }
}));
payMethodSelect === null || payMethodSelect === void 0 ? void 0 : payMethodSelect.addEventListener("focus", () => {
    loadPayMethods();
});
receiverSelector === null || receiverSelector === void 0 ? void 0 : receiverSelector.addEventListener("focus", () => {
    loadPersons();
});
emitterSelector === null || emitterSelector === void 0 ? void 0 : emitterSelector.addEventListener("focus", () => {
    loadPersons();
});
function triggerSaveInvoice() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let unitElements = document.querySelectorAll(".unidades");
            let productsList = [];
            unitElements.forEach((element) => {
                // Obtener los valores de los inputs dentro de cada li
                let cuantity = Number(element.querySelector('input:nth-child(1)').value);
                let type = element.querySelector('input:nth-child(2)').value;
                let priceUnit = Number(element.querySelector('input:nth-child(3)').value);
                let iva = Number(element.querySelector('input:nth-child(4)').value);
                let discount = 0;
                if (discountPerProduct) {
                    discount = Number(element.querySelector('input:nth-child(5)').value);
                }
                else {
                    discount = Number(document.getElementById("descuento_al_total").value);
                }
                // Crear un objeto con los datos y agregarlo a la lista
                let productData = {
                    cuantity: cuantity,
                    type: type,
                    priceUnit: priceUnit,
                    iva: iva,
                    discount: discount
                };
                productsList.push(productData);
            });
            let invoice;
            try {
                invoice = yield window.electronAPI.generateInvoiceFromUsrInput(letterSelector.value, receiverSelector.value, emitterSelector.value, emisionDateInput.value, expirationDateInput.value, productsList, conceptInput.value, Number(irpfInput.value), detailInput.value, payMethodSelect.value, extraPayMethod.value);
            }
            catch (_a) {
                reject("faltan valores");
                return;
            }
            let pdfPath;
            try {
                pdfPath = yield window.electronAPI.openFileDialog(invoice.number, 'pdf');
            }
            catch (_b) {
                reject("selecciona un path valido");
            }
            if (pdfPath.filePath === '') {
                reject("selecciona un path valido");
            }
            try {
                yield window.electronAPI.createPDFfromInvoice(invoice, pdfPath.filePath);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        }));
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
        var descuentoTotal = document.getElementById("descuento_al_total");
        descuentoTotal.classList.add("oculto");
        var descuentoTotalLabel = document.getElementById("des_lbl");
        descuentoTotalLabel.classList.add("oculto");
        document.getElementById("descuento_unidad_btn").innerHTML = "Descuento al total";
    }
    else {
        var unitElements = document.querySelectorAll(".unidades");
        unitElements.forEach((element) => {
            var descToDelete = element.querySelector("#descuento");
            descToDelete.remove();
        });
        var descuentoTotal = document.getElementById("descuento_al_total");
        descuentoTotal.classList.remove("oculto");
        var descuentoTotalLabel = document.getElementById("des_lbl");
        descuentoTotalLabel.classList.remove("oculto");
        document.getElementById("descuento_unidad_btn").innerHTML = "Descuento por unidad";
    }
}
//Añade un nuevo producto
function newProduct() {
    var unitsContainer = document.getElementById("unidades_container");
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
function loadPersons() {
    return __awaiter(this, void 0, void 0, function* () {
        // Obtener las opciones actuales del selector
        let existingOptions = Array.from(receiverSelector.options).map(option => option.text);
        // Cargar clientes
        let clientsList = yield window.electronAPI.getAllSubjectsData("receptor");
        clientsList.forEach((row) => {
            if (!existingOptions.includes(`${row.name} (${row.id})`)) {
                var option = document.createElement("option");
                option.value = row.id;
                option.text = `${row.name} (${row.id})`;
                receiverSelector.add(option);
                existingOptions.push(`${row.name} (${row.id})`);
            }
        });
        // Obtener las opciones actuales del selector
        existingOptions = Array.from(emitterSelector.options).map(option => option.text);
        // Cargar proveedores
        let providersList = yield window.electronAPI.getAllSubjectsData("emisor");
        providersList.forEach((row) => {
            if (!existingOptions.includes(`${row.name} (${row.id})`)) {
                var option = document.createElement("option");
                option.value = row.id;
                option.text = `${row.name} (${row.id})`;
                emitterSelector.add(option);
                existingOptions.push(`${row.name} (${row.id})`);
            }
        });
    });
}
function loadPayMethods() {
    return __awaiter(this, void 0, void 0, function* () {
        let payMethodsOptions = Array.from(payMethodSelect.options).map(option => option.value);
        // Cargar clientes
        let payMethods = yield window.electronAPI.getAllPayMethodTypes();
        payMethods.forEach((row) => {
            if (!payMethodsOptions.includes(row.type)) {
                var option = document.createElement("option");
                option.value = row.type;
                option.text = row.type;
                payMethodSelect.add(option);
                payMethodsOptions.push(row);
            }
        });
        yield showExtraPayMethod();
    });
}
function showExtraPayMethod() {
    return __awaiter(this, void 0, void 0, function* () {
        const field = payMethodSelect.value;
        const payMethodType = yield window.electronAPI.getPayMethodType(field);
        if (payMethodType.extraData) {
            extraPayMethod.classList.remove("oculto");
        }
        else {
            extraPayMethod.classList.add("oculto");
        }
    });
}
// Llamar a las funciones de carga al cargar la página
loadPayMethods();
loadLetters();
loadPersons();
newProduct();
