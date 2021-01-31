var admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://node-odoo.firebaseio.com',
});

module.exports = { admin: admin, fcm: admin.messaging() };
