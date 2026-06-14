/**
 * ETAPA 4: TESTE DE PICO (SPIKE TEST)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 },   
        { duration: '10s', target: 300 },  
        { duration: '1m', target: 300 },   
        { duration: '10s', target: 10 },   
    ],
    
    thresholds: {
        http_req_duration: ['p(95)<1000'], 
        http_req_failed: ['rate<0.05'],    
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
        'resposta contém "APPROVED"': (r) => r.body && r.body.includes('APPROVED'),
        'tempo de resposta < 1000ms': (r) => r.timings.duration < 1000,
    });

    sleep(0.5);
}
