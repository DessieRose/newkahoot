require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.get('/admin', (req, res) => {

    res.sendFile(path.join(__dirname, '/../../frontend/login.html'));
});

app.post('/admin/login', (req, res) => {

    if (req.body.password === process.env.ADMIN_PASSWORD) {
        res.sendFile(path.join(__dirname, '/../../frontend/private/admin.html'));
    } else {
        res.send('Wrong password! <a href="/admin">Try again</a>');
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server is flying! Listening on http://localhost:${PORT}`);
    console.log(`🔐 Admin password loaded: ${process.env.ADMIN_PASSWORD ? "Yes" : "No"}`);
});
