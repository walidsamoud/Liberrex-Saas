export function authBranding() {
    let subdomain = /:\/\/([^\/]+)/.exec(window.location.href)[1].split('.')[0];
    switch (subdomain) {
        case 'orange':
            return process.env.VUE_APP_AUTH_CLASS_ORANGE;
        case 'tt':
            return process.env.VUE_APP_AUTH_CLASS_TT;
        default:
            switch (localStorage.getItem('Server')) {
                case 'tn':
                    return process.env.VUE_APP_AUTH_CLASS_TN;
                case 'gb':
                    return process.env.VUE_APP_AUTH_CLASS_GB;
                case 'ci':
                    return "login-register-bg-CI";
                default:
                    return "login-register-bg";
            }
    }
}