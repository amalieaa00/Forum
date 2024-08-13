require('dotenv').config();
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
//function that creates a database connection
function dbCon() {
    const con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "Sideprojects"
    });
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASS:', process.env.DB_PASS);

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
                //checks if the user has given the correct password
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
//retrieves the post selected by the user from the database.
function getSelectedPost(title, res) {
    const q = `
        SELECT
            p.post_id as id, 
            p.title, 
            p.user AS postedBy, 
            r.user AS repUser, 
            p.content AS mainContent, 
            r.content AS answer 
        FROM 
            posts AS p 
        LEFT JOIN 
            reply AS r 
        ON 
            p.post_id = r.rid 
        WHERE 
            p.title = ?
    `;
    
    conn.query(q, [title], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            console.log(result);
            return res.json(result);
        }
    });
}

async function addReply(rid,user,content,res){
    let q ='INSERT INTO reply (rid,user,content) values (?,?,?)'
    conn.query(q, [rid,user,content], (err, data) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log('Added');
        return res.json(data);
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
    ;
    return getSelectedPost(title, res);
});
app.post('/reply', (req, res) => {
   const {rid,user,content}= req.body;
   console.log(rid);
   addReply(rid,user,content,res);
});


