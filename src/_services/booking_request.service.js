import { authHeader, ApiConfigs } from '../_helpers';

export const bookingRequestService = {
    getAll,
    getPage,
    getById,
    approve,
    decline,
    filtre
};

function filtre(obj) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body : JSON.stringify(obj),
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.booking_requests.filtre}`, requestOptions).then(handleResponse);
}
function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.booking_requests.getAll}`, requestOptions).then(handleResponse);
}


function getPage(page) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.booking_requests.pagination+page}`, requestOptions).then(handleResponse);
}


function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.booking_requests.get.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function approve(request) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body : JSON.stringify(request)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.booking_requests.approve.replace(':id', request.data.id)}`, requestOptions).then(handleResponse);
}


function decline(request) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.booking_requests.decline.replace(':id', request.id)}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) { localStorage.removeItem('user');
                // auto logout if 401 response returned from api
                /*location.reload(true);*/window.location.href = '/login';
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}