const dialogflow = require("@google-cloud/dialogflow");
const { WebhookClient, Suggestion } = require("dialogflow-fulfillment");
const express = require("express");
// const nodemailer = require("nodemailer");
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token_here'; // Replace with your actual auth token
const client = require('twilio')(accountSid, authToken);
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello from Dialogflow Webhook");  
});

app.post("/webhook", async (req, res) => {
    var id = res.req.body.session.substr(43);
    console.log(id);
    const agent = new WebhookClient({ request: req, response: res });

    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add(
            "Hi I am the AI assistant of dialogflow, You can also connect with human directly"
        );
    }

    function booking(agent) {
        const { number, person, email, phone } = agent.parameters;

        agent.add(
            `Hi ${person.name}, Your order has been registered for ${number} person. We sent you email at ${email} and sent a message on your number ${phone}`
        );

        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: `Hi ${person.name}, Your order has been registered for ${number} person. We sent you email at ${email} and sent a message on your number ${phone}` , // Use 'body' for simple text messages
                to: 'whatsapp:+923121382087'
            })
            .then(message => console.log(message.sid))

        console.log("Number of People", number);
        console.log("User Name", person);
        console.log("User Email", email);
        console.log("User Phone Number:", phone);
    }

    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", hi);
    intentMap.set("booking", booking);
    agent.handleRequest(intentMap);
});
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});