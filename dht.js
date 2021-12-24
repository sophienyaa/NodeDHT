const sensor = require("node-dht-sensor");
const cli = require('./cli');
const args = cli.args;

module.exports = { 
    getSensorValue: async function() {
        try {
            const res = await sensor.read(args.sensorType, args.gpio);
        
            let toReturn = {
                temperature: res.temperature.toFixed(2),
                humidity: res.humidity.toFixed(2),
                isValid: res.isValid,
                errors: res.errors
            }
            return toReturn;
        } catch (err) {
            console.error("Failed to read sensor data:", err);
        }
    }
};