// Default Deriv Public App ID
const APP_ID = '1089'; 
const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=' + APP_ID);

const previousPrices = {};

ws.onopen = () => {
  console.log("Connected to Deriv WebSocket");
  
  // Subscribe to market ticks
  ["R_100", "R_75", "R_50"].forEach(symbol => {
    ws.send(JSON.stringify({ ticks: symbol }));
  });
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.msg_type === 'tick') {
    const symbol = data.tick.symbol;
    const price = parseFloat(data.tick.quote).toFixed(2);
    const priceElem = document.getElementById('price-' + symbol);

    if (priceElem) {
      if (previousPrices[symbol]) {
        priceElem.className = price > previousPrices[symbol] ? "price price-up" : "price price-down";
      }
      previousPrices[symbol] = price;
      priceElem.innerText = price;
    }
  }
};