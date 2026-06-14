/**
 * ETAPA 2: TESTE DE CARGA (LOAD TEST)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 50 },  
        { duration: '2m', target: 50 },   
        { duration: '30s', target: 0 },  
    ],
    
    thresholds: {
        http_req_duration: ['p(95)<500'], 
        http_req_failed: ['rate<0.01'],  
    },
};

export default function () {
    const payload = JSON.stringify({
        userId: Math.floor(Math.random() * 10000),
        amount: Math.random() * 1000,
        currency: 'USD',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let response = http.post('http://localhost:3000/checkout/simple', payload, params);

    check(response, {
        'status é 201': (r) => r.status === 201,
        'resposta contém "APPROVED"': (r) => r.body.includes('APPROVED'),
        'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}
