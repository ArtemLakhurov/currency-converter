const API_URL = 'http://localhost:3000/convert';

document.getElementById('convertBtn').addEventListener('click', async () => {
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  const amount = document.getElementById('amount').value;

  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById(
        'result'
      ).innerText = `${amount} ${fromCurrency} = ${data.convertedAmount} ${toCurrency}`;
    } else {
      document.getElementById('result').innerText =
        data.error || 'Error converting currency';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('result').innerText =
      'Something went wrong. Try again later.';
  }
});
