import { authHeader, ApiConfigs } from '../_helpers';

export const paymentService = {
    createTransaction
};


function createTransaction(obj) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body : JSON.stringify(obj),
    };

    return fetch(`${ApiConfigs.base_payment_url+ApiConfigs.payment.createTransaction}`, requestOptions).then(handleResponse);
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) { localStorage.removeItem('user');
                // auto logout if 401 response returned from api
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}