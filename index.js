var express = require('express');
var app = express();

const shell = require('shelljs')

app.use(express.static('public'));

app.get("/goodbye", (req, res) => {
  const findPid = shell.exec("top -l 1 | grep zoom | sed 's/\([^ ]*\).*/\1/'").stdout;
  console.log({findPid});
  const pid = findPid.split("*")[0]
  console.log(`Killing Process: ${pid}`);
  if (pid) {
    //shell.exec(`kill -2 ${pid}`);
    shell.exec('./goodbye.sh')
    //shell.exec(`pkill zoom`)
    res.json({goodbye: pid});
  } else {
    res.json({goodbye: null});
  }
  
})


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
