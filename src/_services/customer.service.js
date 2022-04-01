import { authHeader, ApiConfigs } from '../_helpers';

export const customerService = {
    getAll,
    getPage,
    search,
    getById,
    update,
    create,
    upload,
    notify,
    delete: _delete,
    getNextUid,
    getArchivedTickets,
    getBookings,
    getArchivedBookings,
    addAttachments,
    getAttachments,
    deleteAttachments
};

function deleteAttachments(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.deleteAttachments.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function getAttachments(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.getAttachments.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function addAttachments(attachments) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader() },
        body: attachments
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.addAttachments}`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.getAll}`, requestOptions).then(handleResponse);
}


function getPage(page) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.pagination+page}`, requestOptions).then(handleResponse);
}

function getNextUid(name){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(name)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.getNextUid}`, requestOptions).then(handleResponse);

}
function getArchivedTickets(customer_id){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(customer_id)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.getArchivedTicket}`, requestOptions).then(handleResponse);
}

function getArchivedBookings(customer_id){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(customer_id)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.getArchivedBookings}`, requestOptions).then(handleResponse);
}
function getBookings(customer_id){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(customer_id)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.getBookings}`, requestOptions).then(handleResponse);
}
function search(keyword, page=1) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.filter.replace(':keyword', keyword).replace(':page', page)}`, requestOptions).then(handleResponse);
}


function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.get.replace(':id', id)}`, requestOptions).then(handleResponse);
}

function update(customer) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.update.replace(':id', customer.id)}`, requestOptions).then(handleResponse);
}

function create(customer) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.create}`, requestOptions).then(handleResponse);
}

function upload(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader() },
        body: payload
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.upload}`, requestOptions).then(handleResponse);
}

function notify(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json'  },
        body: JSON.stringify(payload)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers.notify}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.customers._delete.replace(':id', id)}`, requestOptions).then(handleResponse);
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