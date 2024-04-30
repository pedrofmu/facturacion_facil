const { getLetter, getNumbers } = require("../../modify_invoice/getInvoiceIDs");
const { modifyDate } = require("../../modify_invoice/modifyDate");
const { reprintInvoice } = require("../../modify_invoice/reprintPDF");

const letterSelector = document.getElementById("letter_selector");
const numberSelector = document.getElementById("number_selector");
const modifyDateBTN = document.getElementById("modify_date");

document.getElementById("atras_btn").addEventListener("click", () => {
  window.location.href = "../home/home.html"
});

modifyDateBTN.addEventListener("click", async () => {
  try {
    const letter = letterSelector.value;
    const number = numberSelector.value;

    const date = document.getElementById("date_input");

    await modifyDate(date.value, `${letter + number}`);

    if (confirm("Quieres crear un pdf nuevo?") === true) {
      await reprintInvoice(`${letter + number}`);
    }

    alert("Fecha modificada correctamente");
  } catch (error) {
    alert(error)
  }
});

letterSelector.addEventListener("change", () => {
  loadNumbers();
});

async function setup() {
  await loadLetters();
  loadNumbers();
};

function loadLetters() {
  return new Promise(async (resolve, reject) => {
    let lettersOptions = Array.from(letterSelector.options).map(option => option.value);

    // Cargar clientes
    const letters = await getLetter();
    letters.forEach((row) => {
      if (!lettersOptions.includes(row)) {
        var option = document.createElement("option");
        option.value = row;
        option.text = row;
        letterSelector.add(option);
        lettersOptions.push(row);
      }
    });

    resolve();
  });
}

async function loadNumbers() {
  numberSelector.innerHTML = '';
  let numberOptions = Array.from(numberSelector.options).map(option => option.value);

  // Cargar clientes
  const numbers = await getNumbers(letterSelector.value);
  numbers.forEach((row) => {
    if (!numberOptions.includes(row)) {
      var option = document.createElement("option");
      option.value = row;
      option.text = row;
      numberSelector.add(option);
      numberOptions.push(row);
    }
  });
}

setup();
