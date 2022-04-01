import { authHeader, ApiConfigs } from '../_helpers';

export const counterService = {
    getAll,
    get,
    update,
    create,
    open,
    close,
    delete: _delete
};


function getAll(queue) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.counters.getAll.replace(':queue', queue)}`, requestOptions).then(handleResponse);
}


function get(queue, counter) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.counters.get.replace(':queue', queue).replace(':counter', counter)}`, requestOptions).then(handleResponse);
}


function update(queue, counter) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(counter)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.counters.update.replace(':queue', queue).replace(':counter', counter.id)}`, requestOptions).then(handleResponse);
}


function create(queue, counter) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(counter)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.counters.create.replace(':queue', queue)}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(queue, counter) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.counters._delete.replace(':queue', queue).replace(':counter', counter)}`, requestOptions).then(handleResponse);
}


function open(queue, counter) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.counters.open.replace(':queue', queue).replace(':counter', counter)}`, requestOptions)
        .then(handleResponse);
}


function close(queue, counter) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.counters.close.replace(':queue', queue).replace(':counter', counter)}`, requestOptions)
        .then(handleResponse);
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