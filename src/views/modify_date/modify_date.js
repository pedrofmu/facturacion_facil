const { getLetter, getNumbers } = require("../../modify_date/getInvoiceIDs");
const { modifyDate } = require("../../modify_date/modifyDate");

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

    alert(await modifyDate(date.value, `${letter + number}`));
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
