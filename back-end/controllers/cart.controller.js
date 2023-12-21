const db = require('../db');

class CartController {
    async addProductToCart(req, res) {
        const { username, productId } = req.body;

        try {
            const addProductToCartQuery = `
                SELECT add_product_to_cart($1, $2);
            `;

            await db.query(addProductToCartQuery, [username, productId]);
            res.json('');
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину:', error);
            res.status(500).json({ message: 'Произошла ошибка на сервере' });
        }
    }

    async getProductsFromCart(req, res) {
        try {
            const { username } = req.query;

            const sqlQuery = 'SELECT combine_tables_to_cart($1)';
            const result = await db.query(sqlQuery, [username]);

            const parsedData = result.rows.map(item => {
                const regex = /\(([^)]+)\)/;
                const matches = item.combine_tables_to_cart.match(regex);

                if (!matches || !matches[1]) {
                    return null;
                }

                const values = matches[1].split(',').map(value => isNaN(value) ? value.replace(/(^['"]|['"]$)/g, '') : parseFloat(value));

                return {
                    product_id: values[0],
                    product_name: values[1],
                    product_price: values[2],
                    product_rating: values[3],
                    product_picture: values[4],
                    brand_name: values[5],
                    category_name: values[6],
                    count: values[7],
                    stock: values[8]
                };
            });

            res.json(parsedData.filter(Boolean));
        } catch (error) {
            console.error('Ошибка при получении продуктов из корзины:', error);
            res.status(500).json({ message: 'Произошла ошибка на сервере' });
        }
    }


    async checkProductInCart(req, res) {
        const { username, productId } = req.query;

        try {
            const result = await db.query(
                `SELECT 1 FROM cart WHERE username = '${username}' AND product_id = ${productId}`
            );

            const isInCart = result.rowCount > 0 ? true : false;

            res.status(200).json(isInCart);
        } catch (error) {
            console.error('Error checking product in cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async removeProductFromCart(req, res) {
        const { username, productId } = req.query;

        try {
            const result = await db.query(`
                DELETE FROM cart
                WHERE username = '${username}' AND product_id = ${productId}
                RETURNING *;
            `);

            if (result.rows.length > 0) {
                res.status(200).json({ message: 'Product removed successfully' });
            } else {
                res.status(404).json({ message: 'Product not found in the cart' });
            }
        } catch (error) {
            console.error('Error removing product from cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateProductInCart(req, res) {
        const { username, productId, newCount } = req.body;

        try {
            const result = await db.query(`
                UPDATE cart
                SET count = ${newCount}
                WHERE username = '${username}' AND product_id = ${productId}
                RETURNING *;
            `);

            if (result.rows.length > 0) {
                res.status(200).json({ message: 'Product count updated successfully' });
            } else {
                res.status(404).json({ message: 'Product not found in the cart' });
            }
        } catch (error) {
            console.error('Error updating product count in cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async makePurchase(req, res) {
        try {
            const { username } = req.body;

            const result = await db.query('SELECT make_purchase($1)', [username]);

            if (result && result.rows.length > 0) {
                res.status(200).json({ success: true, message: 'Purchase successful' });
            } else {
                res.status(500).json({ success: false, message: 'Failed to make a purchase' });
            }
        } catch (error) {
            console.error('Error during makePurchase:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = new CartController()