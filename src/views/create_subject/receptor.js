const { createPerson } = require("../../create_people/new_person");

const nombre = document.getElementById("nombre_input");
const id = document.getElementById("id_input");
const direccion = document.getElementById("direccion_input");
const contacto = document.getElementById("contacto_input");

document.getElementById("save_btn").addEventListener("click", async () => {
  try {
    await createPerson("receptor", nombre.value, id.value, direccion.value, contacto.value);
    alert("Se ha guardado correctamente el receptor");
  }catch (error) {
    alert(error);
  }
});
