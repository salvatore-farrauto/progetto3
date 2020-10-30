var express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    path = require('path')


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"))
})



app.listen(port);

