const yargs = require('yargs');

const argv = yargs
    .option('gpio', {
        alias: 'g',
        description: 'GPIO pin your DHT sensor is connected to (e.g 4)',
        type: 'integer',
        default: 4,
    })
    .option('sensorType', {
        alias: 's',
        description: 'The type of sensor, e.g DHT22',
        type: 'integer',
        default: 22
    })
    .option('mqttbroker', {
        alias: 'm',
        description: 'The address of your MQTT Broker (e.g -m 192.168.0.10)',
        type: 'string',
    })
    .option('mqttuser', {
        alias: 'u',
        description: 'The username for your MQTT Broker (e.g -u mqttUser)',
        type: 'string',
    })
    .option('mqttpass', {
        alias: 'p',
        description: 'The password for your MQTT Broker (e.g -p mqttPass)',
        type: 'string',
    })
    .option('mqtttopic', {
        alias: 't',
        description: 'MQTT topic to publish to defaults to \'NodeJBD\' (e.g -t MyTopic)',
        type: 'string',
        default: 'NodeJBD'
    })
    .option('pollinginterval', {
        alias: 'i',
        description: 'How frequently to poll the controller in seconds, defaults to 10 (e.g -i 60)',
        type: 'integer',
        default: 10
    })
    .option('loglevel', {
        alias: 'l',
        description: 'Logging level to use, values are trace, debug, info, warn, error, fatal. Defaults to error',
        type: 'string',
        default: 'info'
    })
    .choices('loglevel', ['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .help()
    .alias('help', 'h')
    .epilogue('For more information, check out the project repository at https://github.com/mickwheelz/NodeJBD')
    .env('NODEJBD')
    .demandOption('serialport', 'You must specify a serial port')
    .wrap(yargs.terminalWidth())
    .argv;

module.exports = {
    args: argv
};
