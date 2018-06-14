require('dotenv').config()

const Kafka = require("node-rdkafka");

var consumer = new Kafka.KafkaConsumer({
    'metadata.broker.list': 'localhost:9092',
    'group.id': 'node-rdkafka-consumer',
    'enable.auto.commit': false
});

var topicName = 'test';

// logging debug messages, if debug is enabled
consumer.on('event.log', function (log) {
    console.log(log);
});

//logging all errors
consumer.on('event.error', function (err) {
    console.error('Error from consumer');
    console.error(err);
});

var last_offset = -1;

module.exports = function (io) {

    consumer.on('ready', function (arg) {
        console.log('consumer ready.' + JSON.stringify(arg));

        consumer.subscribe([topicName]);
        consumer.consume();
    });
    
    
    consumer.on('data', function (m) {

        if (m.offset != last_offset) {
            last_offset = m.offset;
            
            console.log(m);

            data = {
                topic: m.topic,
                message: m.value.toString()
            }

            io.sockets.emit('chat', data);
        }
    
    });
    
    consumer.on('disconnected', function (arg) {
        console.log('consumer disconnected. ' + JSON.stringify(arg));
    });
    
    //starting the consumer
    consumer.connect();
}