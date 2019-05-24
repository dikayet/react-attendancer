const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./ServiceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})



exports.createUser = functions.https.onRequest((request, response) => {


  if (request.method !== "POST") {
    response.status(400).send("post requests are not allowed");
    return 0;
  }

  const email = request.body.email;
  const pass = request.body.pass;

  admin.auth().createUser({
    email: email,
    emailVerified: true,
    password: pass,
  })
    .then(function (userRecord) {
      response.json({ "uid": userRecord.uid, "error": null });
      return 1;
    })
    .catch(function (error) {
      response.json({ "uid": null, "error": error });
      return 1;
    });

  return 1;
});
exports.deleteUser = functions.https.onRequest((request, response) => {


  if (request.method !== "POST") {
    response.status(400).send("post requests are not allowed");
    return 0;
  }

  const uid = request.body.uid;

  admin.auth().deleteUser(uid)
    .then(function (userRecord) {
      response.json({ "error": null });
      return 1;
    })
    .catch(function (error) {
      response.json({ "error": error });
      return 1;
    });

  return 1;
});

