const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const localtunnel = require('localtunnel');

app.use(express.json());

const taskRoutes = require('./routes/task-route');
app.use('/', taskRoutes);


app.listen(process.env.PORT, async () => {
    console.log(`App is listening at port: ${PORT}`);

    try {
        const tunnel = await localtunnel({ port: PORT, subdomain: 'asana' });
        console.log(`Local Tunnel URL: ${tunnel.url}`);
    } 
    catch (err) {
        console.error('Error starting localtunnel:', err);
    }
});

