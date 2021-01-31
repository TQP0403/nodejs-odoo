const pgQuery = require('../services/pg-query');
const { fcm } = require('../services/firebase');

module.exports = function (app) {
  app.get('/', (req, res) => res.send('Hello World!!!'));

  app.get('/cart/:pid', async (req, res, next) => {
    let data = (await pgQuery.get_cart(req.params.pid)) || null;
    if (!data) return next(new Error('Cart not found'));
    res.status(200).json(data);
  });

  app.post('/login', async (req, res, next) => {
    if (!req.body.username)
      return next(new Error('param username is required'));
    let data = (await pgQuery.get_user(req.body.username)) || null;
    if (!data) return next(new Error('User not found'));
    return res.status(200).json(data);
  });

  app.post('/fcm', async (req, res, next) => {
    let data = (await pgQuery.get_cart(req.body.partner_id)) || null;

    if (!data) return next(new Error('No data found'));

    let topic = process.env.FCM_TOPIC || 'admin';
    let token = process.env.FCM_ADMIN_TOKEN;

    var message = {
      data: data,
      notification: {
        title: 'Đơn hàng ' + data.so_name,
        body: 'Khách hàng ' + data.partner_name + ' đã đến cửa hàng.',
      },
      android: {
        priority: 'high',
        direct_boot_ok: true,
        notification: {
          sound: 'default',
        },
        data: { click_action: 'FLUTTER_NOTIFICATION_CLICK' },
      },
    };

    if (token) message.token = token;
    else message.topic = topic;

    fcm
      .send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
        return res.status(200).json({ response: response, to: token || topic });
      })
      .catch(next);
  });

  // catch err
  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });
};
