const socket = io();

// Start Button
document.getElementById('start-btn').addEventListener('click', () => {
    // We send a specific signal to the server to begin the game loop
    socket.emit('admin_start_game', { timestamp: Date.now() });
});

// Restart Button
document.getElementById('restart-btn').addEventListener('click', () => {
    if(confirm("Are you sure? This will kick all players and reset scores.")) {
        socket.emit('admin_restart_system');
    }
});

// Listen for status updates
// socket.on('status_update', (data) => {
//     document.getElementById('game-status').innerText = data.message;
// });