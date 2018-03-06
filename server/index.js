const dotenv = require("dotenv").config()

console.log(process.env.SH_KEY)

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const stripe = require("stripe")(process.env.SH_KEY)

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (request, response) => {
  response.send({message: "HII"})
});

app.post("/charge", (request, response) => {
  stripe.charges.create({
    amount: 999,
    currency: "usd",
    description: "charge to " + request.body.stripeEmail,
    source: request.body.stripeToken,
  }, function(error, charge) {
      if(error) {
        response.status(400).send(error.message)
      } else {
        response.send(charge)
      }
  });
})

app.use((req, res, next) => {
  res.status(404);
  const error = new Error('Not Found. 🔍');
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
    error: error.stack
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});