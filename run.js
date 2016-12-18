const port = process.env.PORT || 3000;

require('./app').listen(port, function() {
  console.log('Listening on port ' + port + '...');
});