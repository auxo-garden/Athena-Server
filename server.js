const express = require('express');

var app = express();

app.get('/status', (req, res)=>{
  res.send("Ayyyy Lmao\n");
});

app.listen(process.env.PORT || 8080);
