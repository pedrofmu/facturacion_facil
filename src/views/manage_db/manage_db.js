const { loadPossibleDB } = require("../../manage_env/getSettings");

document.getElementById("atras_btn").addEventListener("click", () => {
  window.location.href = "../home/home.html"
});

async function loadDbInSelector() {
  var possibleDB = await loadPossibleDB();

  const possibleDBSelectors = document.querySelectorAll(".possible_db");

  possibleDBSelectors.forEach((selector) => {
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
