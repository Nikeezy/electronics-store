const db = require('../db');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

class AuthController {
    async register(req, res) {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const userExistsResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    
            if (userExistsResult.rows.length > 0) {
                res.status(400).json({ error: 'Такой пользователь уже существует' });
            } else {
                const result = await db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
                res.status(201).json(result.rows[0]);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req, res) {
        const { username, password } = req.body;
    
        try {
            const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const match = await bcrypt.compare(password, user.password);
    
                if (match) {
                    const uniqueSessionID = uuid.v4();
                    res.cookie('user_session', uniqueSessionID);
                    res.cookie('user', username);
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    res.status(401).json({ error: 'Неверный логин или пароль' });
                }
            } else {
                res.status(401).json({ error: 'Неверный логин или пароль' });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    

    async logout(req, res) {
        try {
            res.clearCookie('user_session');
            res.clearCookie('user');

            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).send('Logout error');
        }
    }
};

module.exports = new AuthController()