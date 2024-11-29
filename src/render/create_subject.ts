const envVar = window.electronAPI.getEnvVar();

console.log(`Env var: ${envVar}`);

document.getElementById("save_btn")?.addEventListener("click", async () => {
    try {
        const taxIdentificationNameInput: HTMLInputElement = document.getElementById("tax_identification_name_input") as HTMLInputElement;

        const personTypeSelect: HTMLSelectElement = document.getElementById("person_type_select") as HTMLSelectElement;

        const idInput: HTMLInputElement = document.getElementById("id_input") as HTMLInputElement;

        const nameInput: HTMLInputElement = document.getElementById("name_input") as HTMLInputElement;

        const postCodeInput: HTMLInputElement = document.getElementById("post_code_input") as HTMLInputElement;

        const townInput: HTMLInputElement = document.getElementById("town_input") as HTMLInputElement;

        const provinceInput: HTMLInputElement = document.getElementById("province_input") as HTMLInputElement;

        const addressInput: HTMLInputElement = document.getElementById("address_input") as HTMLInputElement;

        const contactInput: HTMLInputElement = document.getElementById("contact_input") as HTMLInputElement;

        console.log(personTypeSelect.value);

        await window.electronAPI.createSubjectData(taxIdentificationNameInput.value, personTypeSelect.value, idInput.value, nameInput.value, addressInput.value, postCodeInput.value, townInput.value, provinceInput.value, contactInput.value, `${envVar}`);
        window.electronAPI.myAlert("Se ha guardado correctamente la nueva persona");
    } catch (error) {
        window.electronAPI.myAlert(`${error}`);
    }
});

document.getElementById("exit_btn")?.addEventListener("click", async () => {
    window.close();
});
