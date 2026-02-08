import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));
app.use(express.static('public'));

let activePlayers = [];

app.get('/', (req, res) => {
    
    res.sendFile(path.join(__dirname, '/../../frontend/index.html'));
});

app.get('/game', (req, res) => {

    res.sendFile(path.join(__dirname, '/../../frontend/game.html'));
});

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

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const playerSchema = new mongoose.Schema({
    nickname: String,
    score: { type: Number, default: 0 },
    socketId: String
});

const Player = mongoose.model('Player', playerSchema);


io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);
    socket.on('joinGame', async (name) => {
        try {
            const newPlayer = new Player({ nickname: name, socketId: socket.id });
            await newPlayer.save();

            activePlayers.push({ name: name, id: socket.id });

            socket.emit('personalWelcome', name);

            io.emit('updateUsers', activePlayers.map(p => p.name));

            console.log(`${name} saved to DB and added to lobby.`);
        } catch (err) {
            console.error("Error saving player:", err);
        }
    });

    // socket.on('player_joined', (nickname) => {
    //     console.log(`Player joined: ${nickname} (ID: ${socket.id})`);

    //     // Store this player in memory/database here
    //     players.push({ id: socket.id, name: nickname, score: 0 });
    // });

    socket.on('disconnect', () => {
        activePlayers = activePlayers.filter(p => p.id !== socket.id);
        io.emit('updateUsers', activePlayers.map(p => p.name));
    });
});

// Start Server (Use httpServer, NOT app.listen)
httpServer.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// app.listen(PORT, () => {
//     console.log(`✅ Server is flying! Listening on http://localhost:${PORT}`);
//     console.log(`🔐 Admin password loaded: ${process.env.ADMIN_PASSWORD ? "Yes" : "No"}`);
// });
