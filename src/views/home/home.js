const { loadPossibleDB, changeCurrentDB } = require("../../manage_env/getSettings");

const toCrateInvoiceBtn = document.getElementById("to_create_invoice_btn");
const toEditInvoiceBtn = document.getElementById("to_edit_invoice_btn");
const dbSelector = document.getElementById("db_selector");
const toRecordBookBtn = document.getElementById("to_record_book_btn");
const toManageDb = document.getElementById("to_manage_db");
const toEditDateBtn = document.getElementById("to_edit_date_btn");

dbSelector.addEventListener("change", async () =>{
  try {
    await changeCurrentDB(dbSelector.value);
    alert("Se ha cambiado el espacio de guardado");
  } catch (error){
    alert(error);
  }
});

async function loadDbInSelector() {
  var possibleDB = await loadPossibleDB();

  possibleDB.forEach(element => {
    var opt = document.createElement("option");
    opt.value = element;
    opt.innerHTML = element; // whatever property it has

    // then append it to the select element
    dbSelector.appendChild(opt);
  });
}

toCrateInvoiceBtn.addEventListener("click", () => {
  window.location.href = "../invoices/invoices.html";
});

toEditInvoiceBtn.addEventListener("click", () => {
  window.location.href = "../edit_invoice/edit_invoice.html";
});

toRecordBookBtn.addEventListener("click", () => {
  window.location.href = "../record_book/record_book.html";
});

toManageDb.addEventListener("click", () => {
  window.location.href = "../manage_db/manage_db.html";
});

toEditDateBtn.addEventListener("click", () => {
  window.location.href = "../modify_date/modify_date.html";
});

loadDbInSelector();
