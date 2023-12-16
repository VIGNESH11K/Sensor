const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');  // Add this line to use the path module
const app = express();
const port = 4000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/sensorDataDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const sensorDataSchema = new mongoose.Schema({
    startTime: String,
    endTime: String,
    label: String,
    data: Array,
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Define a route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/collect-data', (req, res) => {
    const { startTime, endTime, label, sensorData } = req.body;

    const newData = new SensorData({ startTime, endTime, label, data: sensorData });
    newData.save()
        .then(() => {
            console.log('Data saved successfully.');
            res.json({ success: true });
        })
        .catch(error => {
            console.error('Error saving data:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        });
});

app.listen(port,'0.0.0.0',() => {
    console.log(`Server is running on port ${port}`);
});