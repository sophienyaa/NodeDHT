const sensor = require("node-dht-sensor");
const cli = require('./cli');
const args = cli.args;

module.exports = { 
    getSensorValue: async function() {
        try {
            const res = await sensor.read(args.sensorType, args.gpio);
            return res;
        } catch (err) {
            console.error("Failed to read sensor data:", err);
        }
    }
};