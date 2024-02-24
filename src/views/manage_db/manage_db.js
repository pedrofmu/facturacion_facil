const { getDBPath } = require("../../manage_env/getPath");
const { loadPossibleDB } = require("../../manage_env/getSettings");
const { createDB, deleteDB, fusionarTablas } = require("../../manage_env/manageDB");

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

document.getElementById("borrar_db_btn").addEventListener("click", async () => {
  try {
    if (confirm("¿Estás seguro de que quieres eliminar el espacio de almacenamiento?") === true) {
      const dbToDelete = document.getElementById("db_to_delete").value;
      await deleteDB(dbToDelete);
      alert("Correctamente eliminado el espacio de almacenamiento");
      loadDbInSelector();
    }
  } catch (error) {
    alert(error);
  }
});

document.getElementById("merge_db").addEventListener("click", async () => {
  try {
    if (confirm("¿Estás seguro de que quieres fusionar las tablas?") === true) {
      const db1Name = document.getElementById("copy_from_db").value;
      const db2Name = document.getElementById("copy_to_db").value;

      const db1Path = await getDBPath(db1Name);
      const db2Path = await getDBPath(db2Name);

      const mode = document.getElementById("merge_modes").value === "sobreescribir";

      await fusionarTablas(db1Path, db2Path, mode);

      alert("Correctamente fusionado el espacio");
    }
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
