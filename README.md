# NodeDHT

Utility to retrieve data from DHT11/DHT22 sensor connected to a Raspberry Pi and publish it to MQTT, written in NodeJS, Based on [NodeRenogy](https://github.com/mickwheelz/NodeRenogy).

Data can then be surfaced in Home Assistant, or anything else that can read from a MQTT bus.

It currenrly supports a single DHT sensor, with support for multiple sensors coming soon.

This software is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Compatibility

Any sensor and SBC supported by the [node-dht-sensor](https://www.npmjs.com/package/node-dht-sensor) library. 

This is currently DHT11, DHT22 and AM2302 sensors, connected to any Raspberry Pi SBC.

## Connecting your Sensor

If you have a bare DHT sensor, you will need a 10k ohm resistor. If you have one on a carrier board, such as commonly available onlinethen you will not need the resistor.

The sensor is powered by 3.3v and has a single data line that is to be connected to a GPIO pin on your Raspberry Pi. The default pin is 4, however you can change this, currently only one sensor is supported.

For further information and diagrams, see [here](https://www.npmjs.com/package/node-dht-sensor), or if you have a bare sensor, see [here](https://pimylifeup.com/raspberry-pi-humidity-sensor-dht22/)

## Using the utility

Ideally you would install/run this on a device that has a DHT sensor connected and is running at all times. I use a Raspberry Pi Zero W, which is more than powerful enough for this use case. 

This also assumes you have a MQTT broker setup and running already. If you don't want to use MQTT you can output the results to the console. Support for other output methods may come at a later date.

You will first need to ensure you have NodeJS v16+ installed on your device.

**NOTE**: If you installed a version of node with `apt-get` on your Pi Zero, please un-install it before installing Node v16.

The Pi Zero/One doesn't have official support for newer version of NodeJS, so follow the instructions [here](https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/) to get it installed.

If you are using a Pi 2 or later, follow the instructions [here](https://lindevs.com/install-node-js-and-npm-on-raspberry-pi/) to install the official NodeSource build.

Once you've got NodeJS installed, then follow the below instructions.

### Installation

1. Clone this repository (or download it) by running;

`git clone https://github.com/mickwheelz/NodeJBD.git`

2. Change to the `NodeDHT` directory and install the dependencies by running the below commands

 - Change to the directory you cloned the code into: `cd NodeDHT`
 - Run installer: `npm install` 
 - Link command: `sudo npm link`

### Running the utility

Basic Example:

`node-dht -g 4 -s 22 -m 192.168.0.10`

This would use GPIO pin `4` for a `DHT22` sensor and connect to MQTT Broker at `192.168.0.10` with no user/password, publishing to the `nodeDHT/state` topic every 10s

The utility supports using different polling intervals and topics, as well as MQTT brokers that need authentication, please see below for a full list of options.

These options can also be passed as environment variables, by appending `NODEDHT_` to the argument (e.g. `NODEDHT_GPIO=4`). This is useful when running as a service (see below section).

|Argument |Alias |Env Var|Description | Example |
|---------|------|----------|-----|----|
|--gpio|-g|NODEDHT_GPIO| The GPIO pin your sensor is connected to, defaults to 4|-g 4|
|--sensorType|-s|NODEDHT_SENSORTYPE|The sensor type as a number e.g DHT**22** or DHT**11**, defaults to 22|-s 22|
|--mqttbroker|-m|NODEDHT_MQTTBROKER|The address of your MQTT Broker|-m 192.168.0.10|
|--mqttuser|-u|NODEDHT_MQTTUSER|The username for your MQTT Broker|-u mqttUser|
|--mqttpass|-p|NODEDHT_MQTTPASS|The password for your MQTT Broker|-p mqttPass| 
|--mqtttopic|-t|NODEDHT_MQTTTOPIC|MQTT topic to publish to defaults to 'NodeJBD'|-t MyTopic|
|--pollinginterval|-i|NODEDHT_POLLINGINTERVAL|How frequently to poll the controller in seconds, defaults to 10|-i 60|
|--loglevel|-l|NODEDHT_LOGLEVEL|Sets the logging level, useful for debugging|-l trace|   
|--help|-h||Show help ||
|--version|||Show version number|  |    

### Running as a service

The utility can be configured to run as a service, including on startup.

These instructions are for Rasbpbian, but should work on any Debian based distro (Ubuntu, etc) or any system that uses systemd.

1. Create a service definition file. This file should contain your required environment variables.

Example:
```
[Unit]
Description=NodeDHT Service

[Service]
ExecStart=node-dht
Restart=always
User=pi
Group=pi
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
Environment=NODEDHT_GPIO=4
Environment=NODEDHT_MQTTBROKER=192.168.0.10
WorkingDirectory=/home/pi/NodeDHT

[Install]
WantedBy=multi-user.target
```
Note the `Environment=...` lines, set any configuration options here such as serial port, MQTT broker, interval, etc.

2. Name this file `nodedht.service` and save it in `/etc/systemd/system`

3. Run the following commands:

 - To start the service: `systemctl start nodedht`

 - To check the logs/ensure its running: `journalctl -u nodedht`

 - To enable the service to run at startup: `systemctl enable nodedht`

## Publishing to MQTT

The utility will publish one topic, with one subtopic on your MQTT Broker. You specify the topic name in the configuration with the default being `NodeDHT`

The subtopic is `<topic>/sensor`. This is published at the set interval and contains the values from your sensor.

Example:
```json
{
	"temperature":"8.60",
	"humidity":"99.90",
	"isValid":true,
	"errors":0
}
```
You can then subscribe the topics with a MQTT client and data as you wish. An example of this would be surfacing it in Home Assistant. See below for more information on how to do that.

## Getting data into Home Assistant

The values can be displayed in Home Assistant by adding them as [sensors](https://www.home-assistant.io/integrations/sensor.mqtt/) in the `configuration.yaml` files. 

Essentially you just need to extract the values from the JSON payload published to MQTT. For each value you want to use in Home Assistant, add a MQTT sensor entry in your config file.

See below for some examples:

```yaml
sensor:
- platform: mqtt
    name: "Temperature"
    state_topic: "NodeDHT/sensor"
    value_template: "{{ value_json['temperature'] }}"
    unit_of_measurement: "C"
    device_class: temperature

- platform: mqtt
    name: "Humidity"
    state_topic: "NodeDHT/sensor"
    value_template: "{{ value_json['humidity'] }}"
    unit_of_measurement: "%"
    device_class: humidity
```
