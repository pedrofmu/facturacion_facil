const { insertNewPayMethod } = require("../../formas_pago/gestionar_formas_pago");

document.getElementById("save_btn").addEventListener("click", async () => {
  try {
    const type = document.getElementById("type_input");
    const hasExtraData = document.getElementById("has_extra_field_input");

    await insertNewPayMethod(type.value, hasExtraData.checked);
    alert("Se ha guardado correctamente el nuevo metodo de pago");
  } catch (error) {
    alert(error);
  }
});

document.getElementById("exit_btn").addEventListener("click", async () => {
  window.close();
});
