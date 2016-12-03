const globalSettings = {
    'baseUrl': 'https://api.instagram.com/v1',
    'accessToken': '691623.1419b97.479e4603aff24de596b1bf18891729f3',
    'callback': 'showRecentMedia',
    'queryParams': {
        'count': 20
    }
};

class User {
    constructor(userId) {
        this.userId = userId;
    }
    getRecentMediaUrl(settings) {
        if (!settings.baseUrl || !settings.accessToken || !settings.callback) { 
            return; 
        }

        let url = `${settings.baseUrl}/users/${this.userId}/media/recent`;
        url += `?access_token=${settings.accessToken}`;
        for (let param in settings.queryParams) {
            if (settings.queryParams.hasOwnProperty(param)) {
                url += `&${param}=${settings.queryParams[param]}&`;
            }
        }
        url = url.slice(0, -1);
        url += `&callback=${settings.callback}`;

        return url;
    }
}

function showRecentMedia(resp) {
    for (let i = 0; i < resp.data.length; i++) {
        
    }
}

function addScript(src) {
    const scriptElement = document.createElement('script');
    scriptElement.src = src;
    document.body.appendChild(scriptElement);
}

document.addEventListener('DOMContentLoaded', () => {
    const user = new User(691623);
    const src = user.getRecentMediaUrl(globalSettings);
    if (src) {
        addScript(src);
    }
});