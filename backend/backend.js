const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 3;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

function dbCon() {
    const con = mysql.createConnection({
        host: "localhost",
        user: "amalieaa",
        password: "*******",
        database: "Sideprojects"
    });
    con.connect(err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Database connected');
    });
    return con;
}

const conn = dbCon();

function getUser(un, pwd, res) {
    const query = 'SELECT * FROM users WHERE email = ?';
    conn.query(query, [un], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length > 0) {
            bcrypt.compare(pwd, data[0].password, (err, compare) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                if (compare) {
                    return res.json(data);
                } else {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    });
}

async function register(name, email, pwd, rpwd, res) {
    if (pwd !== rpwd) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    let q = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const encryptedPassword = await bcrypt.hash(pwd, saltRounds);
    let values = [name, email, encryptedPassword];
    conn.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json(data);
    });
}

function addPost(un, title, post, res) {
    let q = 'INSERT INTO posts (user, title, content) VALUES (?, ?, ?)';
    let vals = [un, title, post];
    conn.query(q, vals, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            return res.json(result);
        }
    });
}

function seeAll(res) {
    const q = 'SELECT user, title FROM posts';
    conn.query(q, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            return res.json(result);
        }
    });
}

function search(term, res) {
    const q = 'SELECT user, title, content FROM posts WHERE title LIKE ? OR content LIKE ?';
    const searchTerm = `%${term}%`;
    conn.query(q, [searchTerm, searchTerm], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            return res.json(result);
        }
    });
}
function getSelectedPost(title,res){
    let q = 'SELECT content FROM posts WHERE title like ?';
    conn.query(q, [title], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            return res.json(result);
        }
    });
}

app.post('/logIn', (req, res) => {
    const email = req.body.email;
    const pwd = req.body.password;
    return getUser(email, pwd, res);
});

app.post('/register', (req, res) => {
    let name = req.body.name;
    const email = req.body.email;
    const pwd = req.body.password;
    const rpwd = req.body.rpwd;
    return register(name, email, pwd, rpwd, res);
});

app.post('/addPost', (req, res) => {
    const email = req.body.email;
    const title = req.body.title;
    const post = req.body.post;
    return addPost(email, title, post, res);
});

app.post('/seeAll', (req, res) => {
    return seeAll(res);
});

app.post('/search', (req, res) => {
    const term = req.body.term;
    return search(term, res);
});
app.post('/getSelected', (req, res) => {
    const title = req.body.title;
    console.log(title);
    return getSelectedPost(title, res);
});

