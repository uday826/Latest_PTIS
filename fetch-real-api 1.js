const https = require('https');
const fs = require('fs');

const agent = new https.Agent({ rejectUnauthorized: false });

function fetchApi(url, method, body, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: method,
      agent: agent,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  try {
    const loginRes = await fetchApi('https://localhost:7293/api/Auth/login', 'POST', { username: 'ADMIN', password: 'User@123' });
    const token = loginRes.token || loginRes.data?.token || loginRes.accessToken || loginRes.data?.accessToken;
    if(!token) {
        console.error('Login failed, no token returned', loginRes);
        return;
    }
    
    const endpoints = [
      { name: 'AssetMaster', url: 'https://localhost:7293/api/AssetMaster?PageNumber=1&PageSize=10&AssetCategoryId=1' },
      { name: 'AssetCategory', url: 'https://localhost:7293/api/AssetCategory?pageSize=1000' },
      { name: 'AssetType', url: 'https://localhost:7293/api/AssetType?pageSize=1000' },
      { name: 'Zone', url: 'https://localhost:7293/api/Zone?pageSize=1000' },
      { name: 'Ward', url: 'https://localhost:7293/api/Ward?pageSize=1000' }
    ];
    
    const report = [];
    report.push('# Asset Register - Real API Responses Report\n');
    report.push('This report contains actual backend API responses capturing the precise data structure returned to the UI.\n');
    
    for(const ep of endpoints) {
      const res = await fetchApi(ep.url, 'GET', null, token);
      report.push('## Endpoint: ' + ep.name);
      report.push('**URL Hit by SSR:** `' + ep.url + '`');
      report.push('### Actual JSON Response Structure');
      report.push('```json\n' + JSON.stringify(res, null, 2) + '\n```\n---');
    }
    
    fs.writeFileSync('C:\\Users\\Somnath.Bansode\\.gemini\\antigravity-ide\\brain\\86f94d90-c767-4a23-8bdc-e34459f8a83a\\real_api_responses_report.md', report.join('\n'));
    // Also save it locally in workspace
    fs.writeFileSync('asset-register-real-api-responses.md', report.join('\n'));
    console.log('Saved real API report!');
  } catch(e) {
    console.error(e);
  }
})();
