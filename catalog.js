(function () {
  "use strict";

  const form = document.getElementById("catalogFilterForm");
  const citySelect = document.getElementById("filterCity");
  const priceMinInput = document.getElementById("priceMin");
  const priceMaxInput = document.getElementById("priceMax");
  const priceMinLabel = document.getElementById("priceMinLabel");
  const priceMaxLabel = document.getElementById("priceMaxLabel");
  const filterError = document.getElementById("filterError");
  const resultsSection = document.getElementById("catalogResults");
  const resultsSummary = document.getElementById("catalogResultsSummary");
  const resultsList = document.getElementById("catalogResultsList");

  const cityNames = {
    novosibirsk: "Новосибирск",
    moscow: "Москва",
    sochi: "Сочи"
  };

  const roomLabels = {
    "1": "1-комнатная",
    "2": "2-комнатная",
    "3": "3-комнатная"
  };

  /** @type {Array<{city:string, rooms:string, title:string, price:number}>} */
  const mockListings = [
    { city: "novosibirsk", rooms: "1", title: "ЖК «Сити Тауэрс», студия с видом", price: 4500000 },
    { city: "novosibirsk", rooms: "2", title: "Новостройка у метро, евродвушка", price: 8900000 },
    { city: "moscow", rooms: "1", title: "Апартаменты в пределах МКАД", price: 12000000 },
    { city: "moscow", rooms: "3", title: "Семейная трёшка в спальном районе", price: 28500000 },
    { city: "sochi", rooms: "2", title: "Квартира у моря, ремонт под ключ", price: 15500000 },
    { city: "sochi", rooms: "3", title: "Пентхаус с террасой", price: 38000000 }
  ];

  function formatRub(n) {
    return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
  }

  function showError(msg) {
    if (!filterError) return;
    filterError.textContent = msg;
    filterError.hidden = false;
  }

  function hideError() {
    if (!filterError) return;
    filterError.hidden = true;
    filterError.textContent = "";
  }

  function syncPriceSliders() {
    if (!priceMinInput || !priceMaxInput) return;
    let min = Number(priceMinInput.value);
    let max = Number(priceMaxInput.value);
    if (min > max) {
      if (document.activeElement === priceMinInput) {
        priceMaxInput.value = String(min);
        max = min;
      } else {
        priceMinInput.value = String(max);
        min = max;
      }
    }
    if (priceMinLabel) priceMinLabel.textContent = formatRub(min).replace(" ₽", "");
    if (priceMaxLabel) priceMaxLabel.textContent = formatRub(max).replace(" ₽", "");
  }

  function filterListings(city, rooms, priceMin, priceMax) {
    return mockListings.filter(function (item) {
      return (
        item.city === city &&
        item.rooms === rooms &&
        item.price >= priceMin &&
        item.price <= priceMax
      );
    });
  }

  function renderResults(city, rooms, priceMin, priceMax, items) {
    if (!resultsSection || !resultsSummary || !resultsList) return;
    resultsSection.hidden = false;
    const cityName = cityNames[city] || city;
    const roomLabel = roomLabels[rooms] || rooms;
    resultsSummary.textContent =
      "Город: " +
      cityName +
      " · " +
      roomLabel +
      " · цена от " +
      formatRub(priceMin) +
      " до " +
      formatRub(priceMax) +
      ". Найдено объектов: " +
      items.length +
      ".";
    resultsList.innerHTML = "";
    if (items.length === 0) {
      const li = document.createElement("li");
      li.className = "catalog-results__empty";
      li.textContent = "По выбранным параметрам пока нет объектов в демо-каталоге. Попробуйте изменить фильтр.";
      resultsList.appendChild(li);
      return;
    }
    items.forEach(function (item) {
      const li = document.createElement("li");
      li.className = "catalog-results__item";
      li.innerHTML =
        '<span class="catalog-results__item-title">' +
        item.title +
        "</span>" +
        '<span class="catalog-results__item-price">' +
        formatRub(item.price) +
        "</span>";
      resultsList.appendChild(li);
    });
  }

  if (priceMinInput && priceMaxInput) {
    priceMinInput.addEventListener("input", syncPriceSliders);
    priceMaxInput.addEventListener("input", syncPriceSliders);
    syncPriceSliders();
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideError();

      const city = citySelect ? citySelect.value : "";
      const roomsRadio = form.querySelector('input[name="rooms"]:checked');
      const rooms = roomsRadio ? roomsRadio.value : "";

      if (!city) {
        showError("Выберите город.");
        return;
      }
      if (!rooms) {
        showError("Выберите количество комнат.");
        return;
      }

      const priceMin = Number(priceMinInput ? priceMinInput.value : PRICE_MIN_BOUND);
      const priceMax = Number(priceMaxInput ? priceMaxInput.value : PRICE_MAX_BOUND);

      if (priceMin > priceMax) {
        showError("Минимальная цена не может быть больше максимальной.");
        return;
      }

      const items = filterListings(city, rooms, priceMin, priceMax);
      renderResults(city, rooms, priceMin, priceMax, items);
    });
  }
})();
