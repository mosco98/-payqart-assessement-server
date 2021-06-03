const express = require("express");
const app = express();
const cors = require("cors");

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("**SERVER IS LIVE**");
});

function calcMonthlyInstallment(shoppingCredit, plan) {
  // plan is in months
  const monthlyInterestPayable = shoppingCredit * 0.04;

  const totalInterestPayable = monthlyInterestPayable * plan;

  const monthlyInstallment = (
    (totalInterestPayable + shoppingCredit) /
    plan
  ).toFixed(2);

  return Number(monthlyInstallment);
}

app.post("/preapproval_one", (req, res) => {
  const { cartValue } = req.body;
  const downPayment = cartValue * 0.3; // minimum downpayment is 30% of cart value
  const shoppingCredit = cartValue - downPayment;
  const plan = 1; // plan is in months

  // Default plan is one month
  const monthlyInstallment = calcMonthlyInstallment(shoppingCredit, plan);

  return res.json({
    success: true,
    downPayment,
    shoppingCredit,
    monthlyInstallment,
    plan
  });
});

app.post("/customize", (req, res) => {
  const { cartValue, downPayment, plan } = req.body;

  const newShoppingCredit = cartValue - downPayment;

  const monthlyInstallment = calcMonthlyInstallment(newShoppingCredit, plan);

  return res.json({
    success: true,
    downPayment,
    shoppingCredit: newShoppingCredit,
    monthlyInstallment,
    plan
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
