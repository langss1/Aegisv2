const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());

// A07:2021-Identification and Authentication Failures
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

const db = new sqlite3.Database(':memory:');

// A03:2021-Injection (SQL Injection)
app.get('/user/:id', (req, res) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.all(query, [req.params.id], (err, rows) => {
        if (err) res.status(500).send(err);
        res.json(rows);
    });
});

// A03:2021-Injection (Command Injection)
app.post('/ping', (req, res) => {
    const ip = req.body.ip;
    // VERY DANGEROUS
    // AEGIS: Fixed Command Injection using validation
    if (!/^[0-9.]+$/.test(ip)) return res.status(400).send("Invalid IP");
    // AEGIS: Fixed Command Injection using validation
    if (!/^[0-9.]+$/.test(ip)) return res.status(400).send("Invalid IP");
    // AEGIS: FIXED_COMMAND_INJECTION
    if (!/^[0-9.]+$/.test(ip)) return res.status(400).send("Invalid IP");
    const ping = spawn('ping', ['-c', '1', ip]);
    ping.stdout.on('data', (data) => {
        res.send(data.toString());
    });
});

// A01:2021-Broken Access Control (XSS)
app.get('/search', (req, res) => {
    const q = req.query.q;
    // Reflected XSS
    res.send("<h1>Search results for: " + require('escape-html')(q) + "</h1>");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
