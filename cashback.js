(function () {
  "use strict";

  var RATE = 0.02;

  var input = document.getElementById("apartmentPrice");
  var output = document.getElementById("cashbackAmount");

  function parseAmount(str) {
    if (!str || typeof str !== "string") return NaN;
    var digits = str.replace(/\s/g, "").replace(/,/g, ".").replace(/[^\d.]/g, "");
    if (digits === "" || digits === ".") return NaN;
    var n = parseFloat(digits);
    return isFinite(n) ? n : NaN;
  }

  function formatRub(n) {
    return new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 0
    }).format(n) + " ₽";
  }

  function update() {
    if (!input || !output) return;
    var price = parseAmount(input.value);
    if (!isFinite(price) || price < 0) {
      output.textContent = "—";
      return;
    }
    var cashback = Math.round(price * RATE);
    output.textContent = formatRub(cashback);
  }

  if (input) {
    input.addEventListener("input", update);
    input.addEventListener("blur", function () {
      var n = parseAmount(input.value);
      if (isFinite(n) && n >= 0) {
        input.value = new Intl.NumberFormat("ru-RU", {
          maximumFractionDigits: 0
        }).format(n);
      }
    });
  }

  update();
})();
