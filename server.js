const fs = require('fs');
const request = require('request');
const express = require('express');
const app = express();
// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

let piesDigits = '';

request.get('https://angio.net/pi/digits/pi1000000.txt', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    piesDigits = body;
  }
});

app.get('/', (req, res) => {
  res.send({
    routes: [
      {
        name: '/all',
        params: false
      },
      {
        name: '/pi/:d',
        params: true,
        paramType: 'Number'
      },
      {
        name: '/limited/:l',
        params: true,
        paramType: 'Number'
      }
    ],
    timestamp: Date.now()
  })
})

app.get('/all', (req, res) => {
  res.send({
    pies: piesDigits,
    timestamp: Date.now()
  })
})

app.get('/pi/:digits', (req, res) => {
  let digits = req.params.digits;
  if (digits && Number.isNaN(Number(digits))) {
    res.send({
      error: 'Digits you provided are not of type Number',
      timestamp: Date.now()
    })
  } else {
    let index = piesDigits.indexOf(digits, 2);
    if (index < 0) {
      res.send({
        error: 'Digits you provided are not occuring in the 1st million digits of PI',
        timestamp: Date.now()
      })
    } else {
      res.send({
        indexOf: `The number you entered occures in PI at index: ${index - 1}`,
        digits: digits,
        timestamp: Date.now()
      })
    }
  }
})

app.get('/limited/:limit', (req, res) => {
  let limit = req.params.limit;
  if (limit && Number.isNaN(Number(limit))) {
    res.send({
      error: 'The limit you provided is not of type Number',
      timestamp: Date.now()
    })
  } else {
    let subPI = piesDigits.substring(0, Number(limit) + 2);
    res.send({
      pi: subPI,
      limit: limit,
      timestamp: Date.now()
    })
  }
})



app.listen(port, host, () => console.log(`Listening on port ${port}!`))

