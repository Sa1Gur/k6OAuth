import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1s', target: 100 },
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

import { authenticateUsingIdentityServer } from './oauth/identity.js';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function setup() {
  const passwordAuthResp = authenticateUsingIdentityServer(
    'localhost',
    'clientid',
    'profile email openid roles',
    {
      username: 'admin',
      password: 'password'
    }
  );

  console.log(JSON.stringify(passwordAuthResp));

  return passwordAuthResp;
}

export default function (data) {

  const endpoin = 'https://endpoint';
  
  const payload = JSON.stringify({
    query: "",
    variables: "",
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.access_token}`,
    },
  };

  const res = http.post(url, payload, params);
  console.log(JSON.stringify(res.json()));
  check(res, { 'status was 200': (r) => r.status == 200 });
}
