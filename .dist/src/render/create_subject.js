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
var _a, _b;
const envVar = window.electronAPI.getEnvVar();
console.log(`Env var: ${envVar}`);
(_a = document.getElementById("save_btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taxIdentificationNameInput = document.getElementById("tax_identification_name_input");
        const personTypeSelect = document.getElementById("person_type_select");
        const idInput = document.getElementById("id_input");
        const nameInput = document.getElementById("name_input");
        const postCodeInput = document.getElementById("post_code_input");
        const townInput = document.getElementById("town_input");
        const provinceInput = document.getElementById("province_input");
        const addressInput = document.getElementById("address_input");
        const contactInput = document.getElementById("contact_input");
        console.log(personTypeSelect.value);
        yield window.electronAPI.createSubjectData(taxIdentificationNameInput.value, personTypeSelect.value, idInput.value, nameInput.value, addressInput.value, postCodeInput.value, townInput.value, provinceInput.value, contactInput.value, `${envVar}`);
        window.electronAPI.myAlert("Se ha guardado correctamente la nueva persona");
    }
    catch (error) {
        window.electronAPI.myAlert(`${error}`);
    }
}));
(_b = document.getElementById("exit_btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    window.close();
}));
