require('dotenv').config()

const Kafka = require("node-rdkafka");

var producer = new Kafka.Producer({
    'metadata.broker.list': 'localhost:9092',
    'dr_cb': true  //delivery report callback
});

var topicName = 'test';
var partition = -1;

//logging debug messages, if debug is enabled
// consumer.on('event.log', function (log) {
//     console.log(log);
// });

//logging all errors
producer.on('event.error', function (err) {
    console.error('Error from producer');
    console.error(err);
});

producer.setPollInterval(100);

producer.on('ready', function (arg) {
    console.log('producer ready.' + JSON.stringify(arg));
});

producer.connect();

module.exports = function (msg) {
    producer.produce(topicName, partition,  new Buffer(msg), null);    
}