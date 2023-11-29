// node server.js

const os = require('os');
const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());

app.get('/getIP', (req, res) => {
    try {
        const networkInterfaces = os.networkInterfaces();
        // Check if 'wlan0' interface exists, otherwise use an alternative
        const ip = networkInterfaces['wlan0'] ? networkInterfaces['wlan0'][0]['address'] : 'Interface not found';
        res.send({ ip });
    } catch (error) {
        // Send a server error response
        res.status(500).send('Server error: ' + error.message);
    }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
