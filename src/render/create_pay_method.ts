document.getElementById("save_btn")?.addEventListener("click", async () => {
  try {
    const type: HTMLInputElement = document.getElementById("type_input") as HTMLInputElement;
    const hasExtraData: HTMLInputElement = document.getElementById("has_extra_field_input") as HTMLInputElement;

    await window.electronAPI.createPayMethod(type.value, hasExtraData.checked);
    window.electronAPI.myAlert("Se ha guardado correctamente el nuevo metodo de pago");
  } catch (error) {
    window.electronAPI.myAlert(`${error}`);
  }
});

document.getElementById("exit_btn")?.addEventListener("click", async () => {
  window.close();
});
