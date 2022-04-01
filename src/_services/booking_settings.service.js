import { authHeader, ApiConfigs } from '../_helpers';

export const bookingSettingsService = {
    getSettings,
    updateSettings
};

function getSettings() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${ApiConfigs.base_url+ApiConfigs.bookings.getSettings}`, requestOptions).then(handleResponse);
}

function updateSettings(payload) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };

    return fetch(`${ApiConfigs.base_url+ApiConfigs.bookings.updateSettings}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                /*location.reload(true);*/window.location.href = '/login';
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}