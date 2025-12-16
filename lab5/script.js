const API_BASE_URL = 'http://localhost:3000/api';

let lamps = [];
let currentList = [];

async function fetchLamps(params = {}) {
  try {
    const url = new URL(`${API_BASE_URL}/lamps`);
    Object.keys(params).forEach(key => {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch lamps');
    return await response.json();
  } catch (error) {
    console.error('Error fetching lamps:', error);
    return [];
  }
}

async function fetchTotalPrice() {
  try {
    const response = await fetch(`${API_BASE_URL}/lamps/total-price`);
    if (!response.ok) throw new Error('Failed to fetch total price');
    const data = await response.json();
    return data.total_price;
  } catch (error) {
    console.error('Error fetching total price:', error);
    return 0;
  }
}

async function createLamp(lampData) {
  try {
    const response = await fetch(`${API_BASE_URL}/lamps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lampData)
    });
    if (!response.ok) throw new Error('Failed to create lamp');
    return await response.json();
  } catch (error) {
    console.error('Error creating lamp:', error);
    throw error;
  }
}

async function updateLamp(id, lampData) {
  try {
    const response = await fetch(`${API_BASE_URL}/lamps/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lampData)
    });
    if (!response.ok) throw new Error('Failed to update lamp');
    return await response.json();
  } catch (error) {
    console.error('Error updating lamp:', error);
    throw error;
  }
}

async function deleteLamp(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/lamps/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete lamp');
    return await response.json();
  } catch (error) {
    console.error('Error deleting lamp:', error);
    throw error;
  }
}

function render(list) {
  const listEl = document.getElementById("lampList");
  if (!listEl) return;
  listEl.innerHTML = "";

  list.forEach(lamp => {
    listEl.insertAdjacentHTML("beforeend", `
      <div class="card">
        <h3>${lamp.type}</h3>
        <p>Manufacturer: ${lamp.manufacturer}</p>
        <p>Power: ${lamp.power}W</p>
        <p>LEDs: ${lamp.ledCount}</p>
        <p>Price: $${lamp.price}</p>
        <div class="actions">
          <button class="remove" data-id="${lamp.id}">Remove</button>
          <button class="edit" data-id="${lamp.id}">Edit</button>
        </div>
      </div>
    `);
  });

  listEl.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.dataset.id);
      if (confirm('Are you sure you want to delete this lamp?')) {
        try {
          await deleteLamp(id);
          lamps = await fetchLamps();
          currentList = [...lamps];
          render(currentList);
        } catch (error) {
          alert('Error deleting lamp');
        }
      }
    });
  });

  listEl.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      localStorage.setItem("editId", id);
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

document.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("lampList")) {
    lamps = await fetchLamps();
    currentList = [...lamps];
    render(currentList);
  }

  document.getElementById("sortToggle")?.addEventListener("change", async (e) => {
    if (e.target.checked) {
      document.getElementById("sortToggl").checked = false;
      currentList = await fetchLamps({ sort_by: 'price', order: 'desc' });
    } else {
      currentList = await fetchLamps();
    }
    render(currentList);
  });

  document.getElementById("sortToggl")?.addEventListener("change", async (e) => {
    if (e.target.checked) {
      document.getElementById("sortToggle").checked = false;
      currentList = await fetchLamps({ sort_by: 'price', order: 'asc' });
    } else {
      currentList = await fetchLamps();
    }
    render(currentList);
  });

  document.getElementById("countBtn")?.addEventListener("click", async () => {
    const total = await fetchTotalPrice();
    document.getElementById("totalPower").textContent = "Total price: $" + total;
  });

  document.getElementById("searchBtn")?.addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value;
    currentList = await fetchLamps({ search: query });
    render(currentList);
  });

  document.getElementById("clearBtn")?.addEventListener("click", async () => {
    document.getElementById("searchInput").value = "";
    currentList = await fetchLamps();
    render(currentList);
  });

  const createForm = document.getElementById("createForm");
  if (createForm) {
    createForm.addEventListener("submit", async e => {
      e.preventDefault();
      const result = validateLampForm();
      if (!result.valid) {
        alert(result.message);
        result.element.focus();
        return;
      }
      try {
        await createLamp(result.data);
        alert("Lamp created successfully!");
        window.location.href = "index.html";
      } catch (error) {
        alert("Error creating lamp");
      }
    });
  }

  const editForm = document.getElementById("editForm");
  if (editForm) {
    const id = parseInt(localStorage.getItem("editId"));
    if (isNaN(id)) {
      alert("Помилка: немає лампи для редагування");
      window.location.href = "index.html";
    } else {
      try {
        const lamp = await fetch(`${API_BASE_URL}/lamps/${id}`).then(r => r.json());
        document.getElementById("type").value = lamp.type;
        document.getElementById("manufacturer").value = lamp.manufacturer;
        document.getElementById("power").value = lamp.power;
        document.getElementById("ledCount").value = lamp.ledCount;
        document.getElementById("price").value = lamp.price;
        document.getElementById("lampId").value = lamp.id;
      } catch (error) {
        alert("Error loading lamp data");
        window.location.href = "index.html";
      }
    }

    editForm.addEventListener("submit", async e => {
      e.preventDefault();
      const result = validateLampForm();
      if (!result.valid) {
        alert(result.message);
        result.element.focus();
        return;
      }
      const id = parseInt(document.getElementById("lampId").value);
      try {
        await updateLamp(id, result.data);
        alert("Lamp updated successfully!");
        window.location.href = "index.html";
      } catch (error) {
        alert("Error updating lamp");
      }
    });
  }
});
