const express = require('express');

const app = express();

function middOne(req, res, next) {
  res.locals.isLogin = true;
  next('route');
}

function middTwo(req, res, next) {
  res.locals.isLogin1 = true;
  next();
}

app.use(middOne);
app.use(middTwo);

app.get('/', middOne, middTwo);

app.get('/', (req, res) => {
  res.write(`<h1>Hello ${res.locals.isLogin} and ${res.locals.isLogin1}`);
  res.end();
});

app.listen(3000, () => {
  console.log(`Server is started at localhost:3000`);
});
