const { loadPossibleDB } = require("../../manage_env/getSettings");
const { createDB } = require("../../manage_env/manageDB");

document.getElementById("atras_btn").addEventListener("click", () => {
  window.location.href = "../home/home.html"
});

document.getElementById("crear_db_btn").addEventListener("click", async () => {
  try {
    const newDBvalue = document.getElementById("nueva_db_name").value;
    await createDB(newDBvalue);
    alert("Correctamente creado el nuevo espacio de almacenamiento");
    loadDbInSelector();
  } catch (error) {
    alert(error);
  }
});

async function loadDbInSelector() {
  var possibleDB = await loadPossibleDB();

  const possibleDBSelectors = document.querySelectorAll(".possible_db");

  possibleDBSelectors.forEach((selector) => {
    // Limpiar opciones anteriores
    selector.innerHTML = "";

    possibleDB.forEach(element => {
      var opt = document.createElement("option");
      opt.value = element;
      opt.innerHTML = element; // whatever property it has

      // then append it to the select element
      selector.appendChild(opt);
    });
  });
}

loadDbInSelector();
