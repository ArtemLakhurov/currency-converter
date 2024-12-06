require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;

// Включаємо CORS
app.use(cors());

// Включаємо JSON для обробки POST-запитів
app.use(express.json());

// Функція для отримання курсів валют
const fetchExchangeRates = async () => {
  try {
    const response = await axios.get(API_URL);
    const rates = response.data;

    // Додаємо гривню (UAH) з курсом 1 до масиву валют
    rates.push({ ccy: 'UAH', base_ccy: 'UAH', buy: '1', sale: '1' });
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    throw new Error('Could not fetch exchange rates');
  }
};

// Маршрут для конвертації валют
app.post('/convert', async (req, res) => {
  const { from, to, amount } = req.body;

  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ error: 'Please provide "from", "to", and "amount"' });
  }

  try {
    const rates = await fetchExchangeRates();
    const fromRate = rates.find((rate) => rate.ccy === from);
    const toRate = rates.find((rate) => rate.ccy === to);

    if (!fromRate || !toRate) {
      return res.status(400).json({ error: 'Invalid currency code provided' });
    }

    // Розрахунок конвертованої суми
    const convertedAmount = (amount * fromRate.sale) / toRate.sale;

    res.json({
      from,
      to,
      amount,
      convertedAmount: convertedAmount.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
