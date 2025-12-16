let lamps = JSON.parse(localStorage.getItem("lamps")) || [
  { type: "LED Ceiling", power: 18, ledCount: 4, manufacturer: "Philips", price: 50 },
  { type: "Desk Lamp", power: 12, ledCount: 2, manufacturer: "IKEA", price: 30 },
  { type: "Floor Lamp", power: 25, ledCount: 6, manufacturer: "Osram", price: 80 },
  { type: "Pendant Lamp", power: 20, ledCount: 3, manufacturer: "Xiaomi", price: 60 },
  { type: "Wall Lamp", power: 15, ledCount: 1, manufacturer: "Philips", price: 40 }
];

let currentList = [...lamps];

function getSortedList(list) {
  const sorted = [...list];
  const maxMin = document.getElementById("sortToggle")?.checked;
  const minMax = document.getElementById("sortToggl")?.checked;

  if(maxMin) sorted.sort((a,b) => b.price - a.price);
  else if(minMax) sorted.sort((a,b) => a.price - b.price);

  return sorted;
}

function render(list) {
  const sortedList = getSortedList(list);
  const listEl = document.getElementById("lampList");
  if (!listEl) return;
  listEl.innerHTML = "";

  sortedList.forEach(lamp => {
    const realIndex = lamps.indexOf(lamp);

    listEl.insertAdjacentHTML("beforeend", `
      <div class="card">
        <h3>${lamp.type}</h3>
        <p>Manufacturer: ${lamp.manufacturer}</p>
        <p>Power: ${lamp.power}W</p>
        <p>LEDs: ${lamp.ledCount}</p>
        <p>Price: $${lamp.price}</p>
        <div class="actions">
          <button class="remove" data-index="${realIndex}">Remove</button>
          <button class="edit" data-index="${realIndex}">Edit</button>
        </div>
      </div>
    `);
  });

  listEl.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      lamps.splice(idx, 1);
      localStorage.setItem("lamps", JSON.stringify(lamps));
      currentList = [...lamps];
      render(currentList);
    });
  });

  listEl.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      localStorage.setItem("editIndex", idx);
      window.location.href = "edit.html";
    });
  });
}


function validateLampForm() {
  const typeEl = document.getElementById("type");
  const manufacturerEl = document.getElementById("manufacturer");
  const powerEl = document.getElementById("power");
  const ledCountEl = document.getElementById("ledCount");
  const priceEl = document.getElementById("price");

  const type = typeEl.value.trim();
  const manufacturer = manufacturerEl.value.trim();
  const power = parseFloat(powerEl.value);
  const ledCount = parseInt(ledCountEl.value);
  const price = parseFloat(priceEl.value);

  if (!type) return { valid: false, message: "Введіть коректно поле Type", element: typeEl };
  if (!manufacturer) return { valid: false, message: "Введіть коректно поле Manufacturer", element: manufacturerEl };
  if (isNaN(power) || power <= 0) return { valid: false, message: "Введіть коректно поле Power (додатнє число)", element: powerEl };
  if (isNaN(ledCount) || ledCount <= 0) return { valid: false, message: "Введіть коректно поле LED Count (додатнє число)", element: ledCountEl };
  if (isNaN(price) || price <= 0) return { valid: false, message: "Введіть коректно поле Price (додатнє число)", element: priceEl };

  return { valid: true, data: { type, manufacturer, power, ledCount, price } };
}

document.addEventListener("DOMContentLoaded", () => {
  if(document.getElementById("lampList")) render(currentList);

  document.getElementById("sortToggle")?.addEventListener("change", () => render(currentList));
  document.getElementById("sortToggl")?.addEventListener("change", () => render(currentList));

  document.getElementById("countBtn")?.addEventListener("click", () => {
    const total = currentList.reduce((sum, lamp) => sum + lamp.price, 0);
    document.getElementById("totalPower").textContent = "Total price: $" + total;
  });

  document.getElementById("searchBtn")?.addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    currentList = lamps.filter(l =>
      l.type.toLowerCase().includes(query) || l.manufacturer.toLowerCase().includes(query)
    );
    render(currentList);
  });

  document.getElementById("clearBtn")?.addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    currentList = [...lamps];
    render(currentList);
  });

  const createForm = document.getElementById("createForm");
  if (createForm) {
    createForm.addEventListener("submit", e => {
      e.preventDefault();
      const result = validateLampForm();
      if (!result.valid) {
        alert(result.message);
        result.element.focus();
        return;
      }
      lamps.push(result.data);
      localStorage.setItem("lamps", JSON.stringify(lamps));
      alert("Lamp created successfully!");
      window.location.href = "index.html";
    });
  }

  const editForm = document.getElementById("editForm");
  if (editForm) {
    const idx = parseInt(localStorage.getItem("editIndex"));
    if (isNaN(idx) || !lamps[idx]) {
      alert("Помилка: немає лампи для редагування");
      window.location.href = "index.html";
    } else {
      document.getElementById("type").value = lamps[idx].type;
      document.getElementById("manufacturer").value = lamps[idx].manufacturer;
      document.getElementById("power").value = lamps[idx].power;
      document.getElementById("ledCount").value = lamps[idx].ledCount;
      document.getElementById("price").value = lamps[idx].price;
      document.getElementById("index").value = idx;
    }

    editForm.addEventListener("submit", e => {
      e.preventDefault();
      const result = validateLampForm();
      if (!result.valid) {
        alert(result.message);
        result.element.focus();
        return;
      }
      const index = parseInt(document.getElementById("index").value);
      lamps[index] = result.data;
      localStorage.setItem("lamps", JSON.stringify(lamps));
      alert("Lamp updated successfully!");
      window.location.href = "index.html";
    });
  }


});
