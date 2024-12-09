document.getElementById("save_btn")?.addEventListener("click", async () => {
    try {
        const type: HTMLInputElement = document.getElementById("type_input") as HTMLInputElement;

        let allNewEntryes: string = "";
        document.querySelectorAll(".unidades").forEach((entry) => {
            allNewEntryes += `,${(entry.querySelector('input:nth-child(1)') as HTMLInputElement).value}`;
        });
        await window.electronAPI.createPayMethod(type.value, allNewEntryes);
        window.electronAPI.myAlert("Se ha guardado correctamente el nuevo metodo de pago");
    } catch (error) {
        window.electronAPI.myAlert(`${error}`);
    }
});

document.getElementById("exit_btn")?.addEventListener("click", async () => {
    window.close();
});

document.getElementById("add_unidad_btn")?.addEventListener("click", () => {
    newEntry();
});

document.getElementById("remove_unidad_btn")?.addEventListener("click", () => {
    var unitsContainer = document.getElementById("unidades_container");
    var lastProduct = unitsContainer?.lastElementChild;

    if (lastProduct) {
        unitsContainer?.removeChild(lastProduct);
    }
});

function newEntry() {
    var unitsContainer = document.getElementById("unidades_container") as HTMLOListElement;

    var newProduct = document.createElement("li");
    newProduct.className = "unidades";

    var newInput = document.createElement("input");
    newInput.type = "text";
    newInput.placeholder = "Nuevo tipo";
    newInput.className = "input";

    // Agregar el input al li
    newProduct.appendChild(newInput);

    unitsContainer.appendChild(newProduct);
}
