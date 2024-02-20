const { loadPossibleDB } = require("../../manage_env/loadDB"); 

const toIngresosBtn = document.getElementById("to_ingresos_btn");
const db_selector = document.getElementById("db_selector");
const toRecordBookBtn = document.getElementById("to_record_book_btn");

async function loadDbInSelector(){
  var possibleDB = await loadPossibleDB();

  possibleDB.forEach(element => {
    var opt = document.createElement("option");
    opt.value = element;
    opt.innerHTML = element; // whatever property it has

    // then append it to the select element
    db_selector.appendChild(opt);
  });
 }

toIngresosBtn.addEventListener("click", () => {
  window.location.href = "../invoices/invoices.html";
});

toRecordBookBtn.addEventListener("click", () => {
  window.location.href = "../record_book/record_book.html";
});

loadDbInSelector();
