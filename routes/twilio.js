import express from 'express';
import twilio from 'twilio';
import 'dotenv/config';
import { createUltravoxCall } from '../ultravox-utils.js';
import { ULTRAVOX_CALL_CONFIG } from '../ultravox-config.js';


const router = express.Router();

const activeCalls = new Map();

// Handle incoming calls from Twilio
router.post('/incoming', async (req, res) => {
    try {
        const agentID = process.env.AGENT_ID;
        console.log('--- Incoming Call Webhook Triggered ---');

        const twilioCallSid = req.body.CallSid;
        const fromNumber = req.body.From;
        const toNumber = req.body.To;

        console.log('Twilio CallSid:', twilioCallSid);
        console.log('From:', fromNumber);
        console.log('To:', toNumber);
        console.log('Request Body:', JSON.stringify(req.body, null, 2));

        // Create the Ultravox call
        console.log('Creating Ultravox call with config:', ULTRAVOX_CALL_CONFIG);
        const response = await createUltravoxCall(ULTRAVOX_CALL_CONFIG, agentID);
        console.log('Ultravox call created:', response);

        // Track the call
        activeCalls.set(response.callId, {
            twilioCallSid: twilioCallSid
        });
        console.log(`Mapped Twilio CallSid ${twilioCallSid} to Ultravox Call ID ${response.callId}`);

        // Create TwiML response to connect to Ultravox stream
        const twiml = new twilio.twiml.VoiceResponse();
        const connect = twiml.connect();
        connect.stream({
            url: response.joinUrl,
            name: 'ultravox'
        });

        const twimlString = twiml.toString();
        console.log('Responding to Twilio with TwiML:\n', twimlString);

        res.type('text/xml');
        res.send(twimlString);

    } catch (error) {
        console.error('Error handling incoming call:', error);

        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Sorry, there was an error connecting your call.');
        
        res.type('text/xml');
        res.send(twiml.toString());
    }
});

export { router };
