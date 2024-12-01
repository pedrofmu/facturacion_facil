const envVar = window.electronAPI.getEnvVar();

console.log(`Env var: ${envVar}`);

function getFormatedName(nameInput: HTMLInputElement, surname1Input: HTMLInputElement, surname2Input: HTMLInputElement): string {
    if (nameInput.value === "" || surname1Input.value === "") {
        return "error";
    }

    if (surname2Input.value === "") {
        return `${nameInput.value},${surname1Input.value}`;
    }

    return `${nameInput.value},${surname1Input.value},${surname2Input.value}`;
}
document.getElementById("save_btn")?.addEventListener("click", async () => {
    try {
        const taxIdentificationNameInput: HTMLInputElement = document.getElementById("tax_identification_name_input") as HTMLInputElement;

        const personTypeSelect: HTMLSelectElement = document.getElementById("person_type_select") as HTMLSelectElement;

        const idInput: HTMLInputElement = document.getElementById("id_input") as HTMLInputElement;

        const nameInput: HTMLInputElement = document.getElementById("name_input") as HTMLInputElement;

        const surname1Input: HTMLInputElement = document.getElementById("surname1_input") as HTMLInputElement;

        const surname2Input: HTMLInputElement = document.getElementById("surname2_input") as HTMLInputElement;

        const postCodeInput: HTMLInputElement = document.getElementById("post_code_input") as HTMLInputElement;

        const townInput: HTMLInputElement = document.getElementById("town_input") as HTMLInputElement;

        const provinceInput: HTMLInputElement = document.getElementById("province_input") as HTMLInputElement;

        const addressInput: HTMLInputElement = document.getElementById("address_input") as HTMLInputElement;

        const contactInput: HTMLInputElement = document.getElementById("contact_input") as HTMLInputElement;

        let personTypeEnum: PersonType;
        switch (personTypeSelect.value) {
            case 'F':
                personTypeEnum = PersonType.F;
                break;
            case 'L':
                personTypeEnum = PersonType.L;
                break;
            default:
                throw new Error("Incorrect value in person type enum");
        }

        const name = getFormatedName(nameInput, surname1Input, surname2Input);
        if (name === "error") {
            window.electronAPI.myAlert("Rellene todos los valores del nombre");
            return;
        }

        await window.electronAPI.createSubjectData(taxIdentificationNameInput.value, personTypeEnum, idInput.value, name, addressInput.value, postCodeInput.value, townInput.value, provinceInput.value, contactInput.value, `${envVar}`);
        window.electronAPI.myAlert("Se ha guardado correctamente la nueva persona");
    } catch (error) {
        window.electronAPI.myAlert(`${error}`);
    }
});

document.getElementById("exit_btn")?.addEventListener("click", async () => {
    window.close();
});
