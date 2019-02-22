// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-1 algorithm
var sha1 = require('sha1');

// include the mysql module
var mysql = require("mysql");

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

// // GET method route for the events page.
// It serves events.html present in client folder
app.get('/events',function(req, res) {
  if (req.session.value == 1) {
    res.sendFile(__dirname + '/client/events.html');
  } else {
    res.redirect('/login');
  }
});

// GET method route for the addEvents page.
// It serves addEvents.html present in client folder
app.get('/addEvents',function(req, res) {
  if (req.session.value == 1) {
    res.sendFile(__dirname + '/client/addEvents.html');
  } else {
    res.redirect('/login');
  }
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  if (req.session.value == 1) {
    res.redirect('/events');
  } else {
    res.sendFile(__dirname + '/client/login.html');
  }
});

// GET method to return the list of events
// The function queries the table events for the list of places and sends the response back to client
app.get('/getListOfEvents', function(req, res) {
  if ((req.session.value == 1) || (req.session.value == 2)) {
    var con = mysql.createConnection({
      host: "cse-curly.cse.umn.edu",
      user: "C4131F18G24", // replace with the database user provided to you
      password: "626", // replace with the database password provided to you
      database: "C4131F18G24", // replace with the database user provided to you
      port: 3306
    });
    con.query('SELECT * FROM tbl_events', function(err, result) {
      res.status(200).json(result);
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/getListOfUsers', function(req, res) {
  if ((req.session.value == 1) || (req.session.value == 2)) {
    var con = mysql.createConnection({
      host: "cse-curly.cse.umn.edu",
      user: "C4131F18G24", // replace with the database user provided to you
      password: "626", // replace with the database password provided to you
      database: "C4131F18G24", // replace with the database user provided to you
      port: 3306
    });
    con.query('SELECT * FROM tbl_accounts', function(err, result) {
      res.status(200).json(result);
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin', function(req, res) {
  if (req.session.value == 1) {
    var con = mysql.createConnection({
      host: "cse-curly.cse.umn.edu",
      user: "C4131F18G24", // replace with the database user provided to you
      password: "626", // replace with the database password provided to you
      database: "C4131F18G24", // replace with the database user provided to you
      port: 3306
    });
    res.sendFile(__dirname + '/client/admin.html');
  } else {
    res.redirect('/login');
  }
});

app.post('/addUser', function(req, res) {
  if (req.session.value == 1) {
    var con = mysql.createConnection({
      host: "cse-curly.cse.umn.edu",
      user: "C4131F18G24", // replace with the database user provided to you
      password: "626", // replace with the database password provided to you
      database: "C4131F18G24", // replace with the database user provided to you
      port: 3306
    });
    var data = req.body;
    con.query('SELECT * FROM tbl_accounts WHERE acc_login = ?', data['acc_login'], function(err, result) {
      if (err) {
        throw (err);
      }
      if (result.length == 0) {
      con.query('INSERT tbl_accounts SET ?', data, function(err) {
        if (err) {
          throw (err);
        }
      });
    }
  });
    res.redirect('/admin')
  } else {
    res.redirect('/login');
  }
});

app.post('/edituser', function(req, res) {
  if (req.session.value == 1) {
    var con = mysql.createConnection({
      host: "cse-curly.cse.umn.edu",
      user: "C4131F18G24", // replace with the database user provided to you
      password: "626", // replace with the database password provided to you
      database: "C4131F18G24", // replace with the database user provided to you
      port: 3306
    });
    var data = req.body;
    con.query('UPDATE tbl_accounts SET acc_name = ?, acc_login = ?, acc_password = ? WHERE acc_id = ?',
    data['acc_name'],data['acc_login'], data['acc_password'], data['acc_id']);
    res.redirect('/events');
  } else {
    res.redirect('/login');
  }
});

app.post('/deleteuser', function(req, res) {
  if (req.session.value == 1) {
    var con = mysql.createConnection({
      host: "cse-curly.cse.umn.edu",
      user: "C4131F18G24", // replace with the database user provided to you
      password: "626", // replace with the database password provided to you
      database: "C4131F18G24", // replace with the database user provided to you
      port: 3306
    });
    var data = req.body;
    console.log(data);
    con.query('DELETE FROM tbl_accounts WHERE acc_id = ?',data['acc_id']);
    res.redirect('/events');
  } else {
    res.redirect('/login');
  }
});

// POST method to insert details of a new event to tbl_events table
app.post('/postEvent', function(req, res) {
  if (req.session.value == 1) {
    var con = mysql.createConnection({
      host: "cse-curly.cse.umn.edu",
      user: "C4131F18G24", // replace with the database user provided to you
      password: "626", // replace with the database password provided to you
      database: "C4131F18G24", // replace with the database user provided to you
      port: 3306
    });
    var data = req.body;
    console.log(data);
    con.query('INSERT tbl_events SET ?', data, function(err) {
      if (err) {
        throw (err);
      }
    });
    res.redirect('/events')
  } else{
    res.redirect('/login');
  }
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  var con = mysql.createConnection({
    host: "cse-curly.cse.umn.edu",
    user: "C4131F18G24", // replace with the database user provided to you
    password: "626", // replace with the database password provided to you
    database: "C4131F18G24", // replace with the database user provided to you
    port: 3306
  });
  var credentials = [req.body.username,sha1(req.body.password)];
  con.query('SELECT * FROM tbl_accounts WHERE acc_name = ? AND acc_password = ?', credentials, function(err, result) {
  //con.query('SELECT * FROM tbl_accounts', function(err, result) {
    if(err) {
      throw err;
    }
    if (result.length == 0) {
      res.status(400).json("Login failure");
    } else {
        req.session.value=1;
        res.status(200).json("Login success");
    }
  });
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  if (req.session.value == 1) {
    req.session.value = 0;
    res.redirect('/login');
  } else {
    res.redirect('/login');
  }
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
});
