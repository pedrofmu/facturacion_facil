const { loadPossibleDB } = require("../../manage_env/loadDB"); 

const toIngresosBtn = document.getElementById("to_ingresos_btn");
const dbSelector = document.getElementById("db_selector");
const toRecordBookBtn = document.getElementById("to_record_book_btn");
const toManageDb = document.getElementById("to_manage_db");

async function loadDbInSelector(){
  var possibleDB = await loadPossibleDB();

  possibleDB.forEach(element => {
    var opt = document.createElement("option");
    opt.value = element;
    opt.innerHTML = element; // whatever property it has

    // then append it to the select element
    dbSelector.appendChild(opt);
  });
 }

toIngresosBtn.addEventListener("click", () => {
  window.location.href = "../invoices/invoices.html";
});

toRecordBookBtn.addEventListener("click", () => {
  window.location.href = "../record_book/record_book.html";
});

toManageDb.addEventListener("click", () => {
  window.location.href = "../manage_db/manage_db.html";
});

loadDbInSelector();
