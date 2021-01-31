const { pg } = require('./pg');

async function get_user(login) {
  let sql =
    'SELECT res_users.id, res_users.partner_id FROM res_users WHERE res_users.login = $1 LIMIT 1';

  let data = await pg.query({ text: sql, values: [login] });
  return data.rows[0];
}

async function get_cart(partner_id) {
  var result;

  let sql =
    'SELECT so.id AS so_id, so.name AS so_name, p.name AS partner_name, so.amount_untaxed, so.amount_tax, so.amount_total FROM sale_order AS so JOIN res_partner AS p on so.partner_id = p.id WHERE p.id = $1 AND so.state = $2';

  let data = await pg.query({
    text: sql,
    values: [parseInt(partner_id) || 0, 'draft'],
  });

  if (data.rows[0]) {
    result = data.rows[0];
    result.so_id = data.rows[0].so_id.toString();
    result.order_lines = await get_order_lines(data.rows[0].so_id);
    result.order_lines = data.rows[0].order_lines.toString();
  }

  if (!result || result.order_lines === '') return;
  return result;
}

async function get_order_lines(sale_order_id) {
  let sql =
    'SELECT sol.id, sol.product_id, sol.name, sol.price_unit, sol.price_subtotal, sol.price_tax, sol.price_total, sol.price_reduce, sol.price_reduce_taxinc, sol.price_reduce_taxexcl, sol.discount FROM sale_order_line AS sol WHERE sol.order_id = $1';

  let data = await pg.query({
    text: sql,
    values: [parseInt(sale_order_id)],
  });

  return data.rows;
}

module.exports = {
  get_user,
  get_cart,
  // get_order_lines,
};
