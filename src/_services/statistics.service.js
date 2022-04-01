import { authHeader, ApiConfigs } from '../_helpers';

export const statisticsService = {
    getAll,
    filter,
    home,
    homeFilter,
    avgWatingService,
    visitFrequency,
    serviceFrequency,
    customerStat,
    serviceDurations,
    serviceDurationsPerCounter,
    bookingPaymentStat,
    bookingPaymentAllTransactions
};

function bookingPaymentAllTransactions(data){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.bookingPaymentAllTransactions}`, requestOptions).then(handleResponse);
}

function bookingPaymentStat(data){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.bookingPaymentStat}`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.getAll}`, requestOptions).then(handleResponse);
}


function home() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.home}`, requestOptions).then(handleResponse);
}



function filter(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.filter}`, requestOptions).then(handleResponse);
}


function homeFilter(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.home_filter}`, requestOptions).then(handleResponse);
}

function avgWatingService(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.avgWatingService}`, requestOptions).then(handleResponse);
}

function visitFrequency(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.visitFrequency}`, requestOptions).then(handleResponse);
}

function serviceFrequency(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.serviceFrequency}`, requestOptions).then(handleResponse);
}

function serviceDurations(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.serviceDurations}`, requestOptions).then(handleResponse);
}

function serviceDurationsPerCounter(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.serviceDurationsPerCounter}`, requestOptions).then(handleResponse);
}

function customerStat(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.statistics.customerStat}`, requestOptions).then(handleResponse);
}





function handleResponse(response) {
    return response.text().then(text => {
        const data = JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) { localStorage.removeItem('user');
                // auto logout if 401 response returned from api
                ///*location.reload(true);*/window.location.href = '/login';
                window.location.href = '/login';
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}