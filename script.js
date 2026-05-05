let incomeChart, pieChart;

function newChat() {

  const chat = document.getElementById("chat");

  chat.innerHTML = "";

  const msg = document.createElement("div");
  msg.innerText = "💬 New chat started...";
  msg.style.opacity = "0.6";
  
  chat.appendChild(msg);
}

async function sendMessage() {

  const input = document.getElementById("input");
  const chat = document.getElementById("chat");

  if (input.value.trim() === "") return;

  const msg = document.createElement("div");
  msg.innerText = input.value;

  msg.style.padding = "8px";
  msg.style.margin = "5px 0";
  msg.style.background = "#111827";
  msg.style.borderRadius = "8px";

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  const userMessage = input.value;
  input.value = "";

  // Show typing indicator
  const typingMsg = document.createElement("div");
  typingMsg.innerText = "🤖: Typing...";
  typingMsg.style.padding = "8px";
  typingMsg.style.margin = "5px 0";
  typingMsg.style.background = "#0f172a";
  typingMsg.style.color = "#94a3b8";
  typingMsg.style.borderRadius = "8px";
  chat.appendChild(typingMsg);
  chat.scrollTop = chat.scrollHeight;

  try {
    let replyText = "";

    // 1. Try to parse math/loan calculation locally (Smart Local AI logic)
    const salaryMatch = userMessage.match(/(\d+)\s*(thousand|k|lakhs?)?\s*salary/i);
    const yearsMatch = userMessage.match(/(\d+)\s*years?/i);
    const interestMatch = userMessage.match(/(\d+)\s*(percent|%)/i);

    if (salaryMatch && yearsMatch && interestMatch) {
      let salary = parseInt(salaryMatch[1]);
      if (salaryMatch[2] && salaryMatch[2].toLowerCase().startsWith('t')) salary *= 1000;
      if (salaryMatch[2] && salaryMatch[2].toLowerCase().startsWith('k')) salary *= 1000;
      if (salaryMatch[2] && salaryMatch[2].toLowerCase().startsWith('l')) salary *= 100000;

      let years = parseInt(yearsMatch[1]);
      let interest = parseInt(interestMatch[1]);

      // Mock calculation: Bank usually allows max EMI of 50% of monthly salary
      let maxEmiAllowed = salary * 0.5;
      let r = interest / 100 / 12;
      let n = years * 12;
      let maxLoan = maxEmiAllowed * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));

      replyText = `Based on a monthly salary of ₹${salary.toLocaleString()}, over ${years} years at ${interest}% interest:\n\nBanks usually allow a max EMI of 50% of your salary (₹${maxEmiAllowed.toLocaleString()}). With that EMI, the maximum loan amount you can take is roughly ₹${Math.round(maxLoan).toLocaleString()}.`;
    } else {
      // 2. Fallback to Wikipedia Free API to answer general financial questions
      const encodedQuery = encodeURIComponent(userMessage + " finance");
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&utf8=&format=json&origin=*`);
      const data = await response.json();

      if (data.query.search.length > 0) {
        // Strip HTML tags from wiki snippet
        let snippet = data.query.search[0].snippet.replace(/(<([^>]+)>)/gi, "");
        replyText = `Here is what I found: ${snippet}... (Source: Wikipedia)`;
      } else {
        replyText = "I'm a simple financial bot. Please ask me to calculate a loan based on your salary, years, and interest (e.g., 'What loan can I take with 40k salary for 2 years at 5% interest?'), or ask a general financial term!";
      }
    }

    chat.removeChild(typingMsg);

    const botMsg = document.createElement("div");
    botMsg.innerText = "🤖: " + replyText;
    botMsg.style.padding = "8px";
    botMsg.style.margin = "5px 0";
    botMsg.style.background = "#0f172a";
    botMsg.style.color = "#22c55e";
    botMsg.style.borderRadius = "8px";
    botMsg.style.whiteSpace = "pre-wrap";

    chat.appendChild(botMsg);
    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    if (chat.contains(typingMsg)) chat.removeChild(typingMsg);
    console.error("Error fetching API:", error);
  }
}

const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const years = document.getElementById("years");

function calculate() {

  const P = amount.value;
  const r = rate.value / 100 / 12;
  const n = years.value * 12;

  document.getElementById("amountVal").innerText = "₹" + P;
  document.getElementById("rateVal").innerText = rate.value + "%";
  document.getElementById("yearsVal").innerText = years.value + " yrs";

  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  document.getElementById("emi").innerText = "₹" + emi.toFixed(0);

  updateCharts(P, emi, n);
}

amount.oninput = rate.oninput = years.oninput = calculate;

function updateCharts(P, emi, n) {

  if (incomeChart) incomeChart.destroy();

  incomeChart = new Chart(document.getElementById("incomeChart"), {
    type: "bar",
    data: {
      labels: ["10k", "20k", "30k", "40k"],
      datasets: [
        { label: "Income", data: [10000, 20000, 30000, 40000] },
        { label: "EMI", data: [emi, emi, emi, emi] }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  if (pieChart) pieChart.destroy();

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "doughnut",
    data: {
      labels: ["Principal", "Interest"],
      datasets: [{
        data: [P, emi * n - P]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

calculate();
