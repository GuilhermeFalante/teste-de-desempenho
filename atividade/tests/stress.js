/**
 * ETAPA 3: TESTE DE ESTRESSE (STRESS TEST)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 200 },  
        { duration: '2m', target: 500 },  
        { duration: '2m', target: 1000 }, 
    ],
    
    thresholds: {
        http_req_duration: ['p(95)<1500'], 
        http_req_failed: ['rate<0.05'],    
    },
};

export default function () {
    const payload = JSON.stringify({
        userId: Math.floor(Math.random() * 10000),
        transactionId: Math.random().toString(36).substring(7),
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let response = http.post('http://localhost:3000/checkout/crypto', payload, params);

    check(response, {
        'status é 201': (r) => r.status === 201,
        'resposta contém "SECURE_TRANSACTION"': (r) => r.body && r.body.includes('SECURE_TRANSACTION'),
    });

}
