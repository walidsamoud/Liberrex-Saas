import { authHeader, ApiConfigs } from '../_helpers';

export const businessService = {
    update,
    updateLocation,
    updateWorkingDays,
    updateTranslations,
    getTranslations,
    getAllHolidays,
    createHoliday,
    deleteHoliday
};

function getAllHolidays() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.business.get_holidays}`, requestOptions).then(handleResponse);
}

function createHoliday(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader() },
        body: data
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.business.create_holiday}`, requestOptions).then(handleResponse);
}

function deleteHoliday(holiday_id) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader() },
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.business.delete_holiday.replace(':id', holiday_id)}`, requestOptions).then(handleResponse);
}

function update(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader() },
        body: data
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.business.update}`, requestOptions).then(handleResponse);
}


function updateLocation(data) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.business.updateLocation}`, requestOptions).then(handleResponse);
}


function updateWorkingDays(workingDays) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(workingDays)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.business.update_working_days}`, requestOptions).then(handleResponse);
}


function updateTranslations(translations) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(translations)
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.business.update_translations}`, requestOptions).then(handleResponse);
}


function getTranslations() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.business.get_translations}`, requestOptions).then(handleResponse);
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