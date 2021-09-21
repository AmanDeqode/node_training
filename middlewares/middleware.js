const express = require('express');

const app = express();

const isSkipped = false;

function md1(req, res, next) {
  if (isSkipped) {
    res.locals.isLogin1 = true;
    console.log(isSkipped);
    console.log('Middleware 1 executed successfully..!');
    next();
  }
}
function md2(req, res, next) {
  res.locals.isLogin2 = true;
  console.log('Middleware 2 executed successfully..!');
  next();
}
function md3(req, res, next) {
  res.locals.isLogin3 = true;
  console.log('Middleware 3 executed successfully..!');
  next('route');
}
function md4(req, res, next) {
  if (isSkipped) {
    res.locals.isLogin4 = true;
    console.log('Middleware 4 executed successfully..!');
    next();
  }
}
function md5(req, res, next) {
  res.locals.isLogin5 = true;
  console.log('Middleware 5 executed successfully..!');
  next();
}
function md6(req, res, next) {
  res.locals.isLogin6 = true;
  console.log('Middleware 6 executed successfully..!');
  next();
}

//app.get('/', md1,md2,md3,md4,md6);

app.get('/', md2, md3, md4, md6);
app.get('/', md5, (req, res) => {
  res.send(
    `Hello ${res.locals.isLogin1} , ${res.locals.isLogin2} , ${res.locals.isLogin3} , ${res.locals.isLogin4} , ${res.locals.isLogin5}, ${res.locals.isLogin6}`
  );
});

app.listen(3000, () => {
  console.log('localhost:3000');
});
