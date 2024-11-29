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
(_a = document.getElementById("save_btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = document.getElementById("type_input");
        const hasExtraData = document.getElementById("has_extra_field_input");
        yield window.electronAPI.createPayMethod(type.value, hasExtraData.checked);
        window.electronAPI.myAlert("Se ha guardado correctamente el nuevo metodo de pago");
    }
    catch (error) {
        window.electronAPI.myAlert(`${error}`);
    }
}));
(_b = document.getElementById("exit_btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    window.close();
}));
