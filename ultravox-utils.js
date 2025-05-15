import https from 'node:https';


// Create Ultravox call and get join URL
export async function createUltravoxCall(callConfig, agentID) {
    const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;
  
    const request = https.request(`https://api.ultravox.ai/api/agents/${agentID}/calls`, {
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
  
