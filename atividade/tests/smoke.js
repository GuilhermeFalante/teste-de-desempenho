/**
 * ETAPA 1: SMOKE TEST
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 1, 
    duration: '30s', 
    
    thresholds: {
        http_req_duration: ['p(95)<500'], 
        http_req_failed: ['rate<0.01'], 
    },
};

export default function () {
    let response = http.get('http://localhost:3000/health');

    check(response, {
        'status é 200': (r) => r.status === 200,
        'resposta contém "status: UP"': (r) => r.status === 200 && r.body && r.body.includes('UP'),
        'tempo de resposta < 100ms': (r) => r.timings.duration < 100,
    });

    sleep(1);
}
