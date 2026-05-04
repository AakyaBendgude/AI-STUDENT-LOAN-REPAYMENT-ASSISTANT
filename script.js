let incomeChart, pieChart;

function newChat() {

const chat = document.getElementById("chat");

chat.innerHTML = "";

const msg = document.createElement("div");
msg.innerText = "💬 New chat started...";
msg.style.opacity = "0.6";

chat.appendChild(msg);
}

function sendMessage() {

const input = document.getElementById("input");
const chat = document.getElementById("chat");

if(input.value.trim() === "") return;

const msg = document.createElement("div");
msg.innerText = input.value;

msg.style.padding = "8px";
msg.style.margin = "5px 0";
msg.style.background = "#111827";
msg.style.borderRadius = "8px";

chat.appendChild(msg);

chat.scrollTop = chat.scrollHeight;

input.value = "";
}

const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const years = document.getElementById("years");

function calculate() {

const P = amount.value;
const r = rate.value/100/12;
const n = years.value*12;

document.getElementById("amountVal").innerText = "₹"+P;
document.getElementById("rateVal").innerText = rate.value+"%";
document.getElementById("yearsVal").innerText = years.value+" yrs";

const emi = (P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);

document.getElementById("emi").innerText = "₹"+emi.toFixed(0);

updateCharts(P, emi, n);
}

amount.oninput = rate.oninput = years.oninput = calculate;

function updateCharts(P, emi, n){

if(incomeChart) incomeChart.destroy();

incomeChart = new Chart(document.getElementById("incomeChart"), {
type:"bar",
data:{
labels:["10k","20k","30k","40k"],
datasets:[
{label:"Income",data:[10000,20000,30000,40000]},
{label:"EMI",data:[emi,emi,emi,emi]}
]
},
options:{responsive:true,maintainAspectRatio:false}
});

if(pieChart) pieChart.destroy();

pieChart = new Chart(document.getElementById("pieChart"), {
type:"doughnut",
data:{
labels:["Principal","Interest"],
datasets:[{
data:[P, emi*n - P]
}]
},
options:{responsive:true,maintainAspectRatio:false}
});
}

calculate();