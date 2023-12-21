const db = require('../db');

class UserController {
    async getAllCategories(req, res) {
        const categories = await db.query('SELECT * FROM categories');
        res.json(categories.rows);
    }

    async getProductsByFilter(req, res) {
        try {
            const { category, current_page, items_per_page, ...filterParams } = req.query;

            const cleanedFilterParams = Object.fromEntries(Object.entries(filterParams).filter(([_, value]) => !['undefined', undefined, 'null', null, ''].includes(value)));

            const queryParams = [category, cleanedFilterParams, current_page || 1, items_per_page || 10].map(value => {
                if (typeof value === 'object' && value !== null) {
                    return Object.fromEntries(Object.entries(value).map(([key, val]) => {
                        if (Array.isArray(val)) {
                            return [key, val.map(item => isNaN(item) ? (typeof item === 'string' ? `'${item}'` : item) : parseFloat(item))];
                        } else {
                            return [key, isNaN(val) ? (typeof val === 'string' ? `'${val}'` : val) : parseFloat(val)];
                        }
                    }));
                } else {
                    return isNaN(value) ? (typeof value === 'string' ? `'${value}'` : value) : parseFloat(value);
                }
            });

            const result = await db.query(
                `SELECT * FROM get_products_by_filter($1, $2, $3, $4)`, queryParams,
            );

            const totalCount = result.rowCount ? parseInt(result.rows[0].row_num, 10) : 0;

            res.json({ products: result.rows, totalCount: totalCount });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getProductById(req, res) {
        const { category, productId } = req.params;

        let sqlQuery = `SELECT * FROM get_product_by_id($1, $2)`;

        const result = await db.query(sqlQuery, [category, productId]);

        res.json(result.rows[0].get_product_by_id);
    }

    async getFilterByCategory(req, res) {
        const { tableName } = req.params;

        try {
            const filters = await db.query(`SELECT get_filter_by_category($1)`, [tableName]);

            res.json(filters.rows[0].get_filter_by_category);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    async getAllBrands(req, res) {
        const brands = await db.query('SELECT * FROM brands');
        res.json(brands.rows);
    }
}

module.exports = new UserController()