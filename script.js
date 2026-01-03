// ================= CONFIG =================
const BASE_URL = "https://hexarate.paikama.co/api/rates";

// ================= DOM ELEMENTS =================
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// ================= POPULATE DROPDOWNS =================
dropdowns.forEach((select) => {
  for (let code in countryList) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code;
    select.append(option);

    // Default selections
    if (select.name === "from" && code === "USD") {
      option.selected = true;
    }
    if (select.name === "to" && code === "INR") {
      option.selected = true;
    }
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
});

// ================= UPDATE FLAGS =================
const updateFlag = (element) => {
  const code = element.value;
  const countryCode = countryList[code];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// ================= EXCHANGE LOGIC =================
const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }

    const from = fromCurr.value;
    const to = toCurr.value;

    const URL = `https://hexarate.paikama.co/api/rates/${from}/${to}/latest`;
    const response = await fetch(URL);
    const data = await response.json();

    // NOTE: correct field is data.data.mid
    const rate = data.data.mid;
    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(error);
  }
};


// ================= EVENTS =================
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
