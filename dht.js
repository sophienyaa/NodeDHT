const sensor = require("node-dht-sensor");

module.exports = { 
    getSensorValue: async function() {
        try {
            const res = await sensor.read(22, 4);
            console.log(
            `temp: ${res.temperature.toFixed(1)}°C, ` +
                `humidity: ${res.humidity.toFixed(1)}%`
            );
            return res;
        } catch (err) {
            console.error("Failed to read sensor data:", err);
        }
    }
};