const accountSid = 'ACf319eede7d59e02b5';
const authToken = '';
const client = require('twilio')(accountSid, authToken);
client.messages
    .create({
        body: 'Hi  there',
        from: '+13305251514',
        to: '+923121382087'
    })
    .then(message => console.log(message.sid));