
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const PORT = 8000;
const serviceAccount = require('./adminConfig/fbServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sdkactivity-6ae10.firebaseio.com"
  });


const checkAuth = (req, res, next) => {
    if (req.headers.authtoken) {
        admin.auth().verifyIdToken(req.headers.authtoken)
          .then(() => {
            next();
          }).catch(() => {
            res.status(403).send('Unauthorized');
          });
      } else {
        res.status(403).send('Unauthorized');
      }
}

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get('/api', checkAuth, (req, res)=> {
    res.json({
        message: 'Server says hello there bud :)'
    });
});

app.listen(PORT, () => {
    console.log('Port listening on port '+ PORT);
})



