import 'dotenv/config';
import https from 'node:https';

// Configuration
const ULTRAVOX_API_KEY = 'yfRrGAUk.AFsRsSg7ubYbVeh5ZMTFITtt4pFs3bWW';
const ULTRAVOX_API_URL = 'https://api.ultravox.ai/api';


// Create Ultravox call and get join URL
export async function createUltravoxCall(callConfig, agentID) {
 

    const request = https.request(`${ULTRAVOX_API_URL}/agents/${agentID}/calls`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': ULTRAVOX_API_KEY
        }
    });

  

    return new Promise((resolve, reject) => {
        let data = '';

        request.on('response', (response) => {
         

            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(JSON.parse(data)));
        });

        request.on('error', reject);
        request.write(JSON.stringify(callConfig));
        request.end();
    });
}

