let lamps = [
  { type: "LED Ceiling", power: 18, ledCount: 4, manufacturer: "Philips", price: 50 },
  { type: "Desk Lamp", power: 12, ledCount: 2, manufacturer: "IKEA", price: 30 },
  { type: "Floor Lamp", power: 25, ledCount: 6, manufacturer: "Osram", price: 80 },
  { type: "Pendant Lamp", power: 20, ledCount: 3, manufacturer: "Xiaomi", price: 60 },
  { type: "Wall Lamp", power: 15, ledCount: 1, manufacturer: "Philips", price: 40 }, 
];

const listEl = document.getElementById("lampList");
const totalEl = document.getElementById("totalPower");

let currentList = [...lamps];

function getSortedList(list) {
  const sorted = [...list];
  const maxMin = document.getElementById("sortToggle").checked;
  const minMax = document.getElementById("sortToggl").checked;

  if(maxMin) sorted.sort((a,b) => b.price - a.price);
  else if(minMax) sorted.sort((a,b) => a.price - b.price);

  return sorted;
}

function render(list) {
  const sortedList = getSortedList(list);
  listEl.innerHTML = "";
  sortedList.forEach(lamp => {
    listEl.insertAdjacentHTML("beforeend", `
      <div class="card">
        <h3>${lamp.type}</h3>
        <p>Manufacturer: ${lamp.manufacturer}</p>
        <p>Power: ${lamp.power}W</p>
        <p>LEDs: ${lamp.ledCount}</p>
        <p>Price: $${lamp.price}</p>
      </div>
    `);
  });
}

document.getElementById("sortToggle").addEventListener("change", () => render(currentList));
document.getElementById("sortToggl").addEventListener("change", () => render(currentList));

document.getElementById("countBtn").addEventListener("click", () => {
  const total = currentList.reduce((sum, lamp) => sum + lamp.price, 0);
  totalEl.textContent = "Total price: $" + total;
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  currentList = lamps.filter(l => 
    l.type.toLowerCase().includes(query) || l.manufacturer.toLowerCase().includes(query)
  );
  render(currentList);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  currentList = [...lamps];
  render(currentList);
});

render(currentList);
