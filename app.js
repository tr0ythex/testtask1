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
        let mediaItemDiv = document.createElement('div');
        mediaItemDiv.className = 'media-item';

        let mediaItemHeader = document.createElement('div')
        let mediaItemPicture = document.createElement('div')
        let mediaItemLikes = document.createElement('div')
        let mediaItemDescription = document.createElement('div')

        mediaItemHeader.className = 'media-item__header';
        mediaItemPicture.className = 'media-item__picture';
        mediaItemLikes.className = 'media-item__likes';
        mediaItemDescription.className = 'media-item__description';

        // profile img
        let profileImg = document.createElement('img');
        profileImg.src = resp.data[i].user.profile_picture;
        profileImg.classList.add('img-round', 'img-profile');

        // username and location
        let usernameLocationDiv = document.createElement('div');
        usernameLocationDiv.className = 'username-location';
        let usernameDiv = document.createElement('div');
        usernameDiv.className = 'username';
        usernameDiv.innerText = resp.data[i].user.username;
        let locationDiv = document.createElement('div');
        locationDiv.className = 'location';
        locationDiv.innerText = resp.data[i].location ? resp.data[i].location.name : '';
        usernameLocationDiv.appendChild(usernameDiv);
        usernameLocationDiv.appendChild(locationDiv);

        // time ago
        let timeAgoDiv = document.createElement('div');
        timeAgoDiv.className = 'time-ago';
        let createdDate = new Date(resp.data[i].created_time * 1000);
        let currentDate = new Date();
        timeAgoDiv.innerText = this.getTimeDiff(currentDate, createdDate);

        // header
        mediaItemHeader.appendChild(profileImg);
        mediaItemHeader.appendChild(usernameLocationDiv);
        mediaItemHeader.appendChild(timeAgoDiv);

        // post pic
        let postImg = document.createElement('img');
        postImg.src = resp.data[i].images.standard_resolution.url;
        postImg.className = 'img-post';
        mediaItemPicture.appendChild(postImg);

        // likes
        let heart = document.createElement('span');
        heart.innerHTML = '&#9825; ';
        heart.addEventListener('click', () => {
            alert(`Id записи: ${resp.data[i].id}`);
        });
        heart.className = 'heart';
        let likesCount = document.createElement('span');
        likesCount.innerText = resp.data[i].likes.count
        mediaItemLikes.appendChild(heart);
        mediaItemLikes.appendChild(likesCount);

        // description
        mediaItemDescription.innerText = resp.data[i].caption.text;

        // media final div
        mediaItemDiv.appendChild(mediaItemHeader);
        mediaItemDiv.appendChild(mediaItemPicture);
        mediaItemDiv.appendChild(mediaItemLikes);
        mediaItemDiv.appendChild(mediaItemDescription);

        // column
        let colElem = document.getElementsByClassName('col')[i % 3];
        colElem.appendChild(mediaItemDiv);
    }
}

function getTimeDiff(currentDate, createdDate) {
    timeDiffSec = (currentDate - createdDate)/1000;
    if (timeDiffSec < 60) {
        return Math.floor(timeDiffSec) + ' с';
    } else if (timeDiffSec/60 < 60) {
        return Math.floor(timeDiffSec/60) + ' мин';
    } else if (timeDiffSec/3600 < 24) {
        return Math.floor(timeDiffSec/3600) + ' ч';
    } else if (timeDiffSec/3600/24 < 7) {
        return Math.floor(timeDiffSec/3600/24) + ' дн.';
    } else {
        return Math.floor(timeDiffSec/3600/24/7) + ' нед.';
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