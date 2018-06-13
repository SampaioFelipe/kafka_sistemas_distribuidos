require('dotenv').config()

const Kafka = require("node-rdkafka");

// var kafkaConf = {
//     "group.id": "cloudkarafka-example",
//     "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
//     "socket.keepalive.enable": true,
//     "security.protocol": "SASL_SSL",
//     "sasl.mechanisms": "SCRAM-SHA-256",
//     "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
//     "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
//     "debug": "generic,broker,security"
//   };

// const topics = [process.env.CLOUDKARAFKA_TOPIC];

var consumer = new Kafka.KafkaConsumer({
    'metadata.broker.list': 'localhost:9092',
    'group.id': 'node-rdkafka-consumer',
    'enable.auto.commit': false
});

var topicName = 'test';

//logging debug messages, if debug is enabled
// consumer.on('event.log', function (log) {
//     console.log(log);
// });

//logging all errors
consumer.on('event.error', function (err) {
    console.error('Error from consumer');
    console.error(err);
});

var last_offset = 0;

module.exports = function (io) {

    consumer.on('ready', function (arg) {
        console.log('consumer ready.' + JSON.stringify(arg));
    
        consumer.subscribe([topicName]);
        //start consuming messages
        consumer.consume();
    });
    
    
    consumer.on('data', function (m) {

        // if (counter % numMessages === 0) {
        //     console.log('calling commit');
        //     consumer.commit(m);
        //   }

        if (m.offset != last_offset) {
            last_offset = m.offset;
            
            console.log(m);

            data = {
                handle: m.topic,
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