const globalSettings = {
    'baseUrl': 'https://api.instagram.com/v1',
    'accessToken': '691623.1419b97.479e4603aff24de596b1bf18891729f3',
    'callback': 'saveRecentMedia',
    'queryParams': {
        'count': 20
    },
    display: {
        colCount: 3,
        widthLarge: 920,
        widthMedium: 580
    }
};

const recentPosts = [];

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

class Post {
    constructor(
        id,
        avatar,
        author,
        location,
        timeAgo,
        picture,
        likesCount,
        caption
    ) {
        this.id = id;
        this.avatar = avatar;
        this.author = author;
        this.location = location;
        this.timeAgo = timeAgo;
        this.picture = picture;
        this.likesCount = likesCount;
        this.caption = caption;;
    }
}

function saveRecentMedia(resp) {
    for (let post of resp.data) {
        recentPosts.push(
            new Post(
                post.id,
                post.user.profile_picture,
                post.user.username,
                post.location ? post.location.name : '',
                getTimeDiff(new Date(), new Date(post.created_time * 1000)),
                post.images.standard_resolution.url,
                post.likes.count,
                post.caption.text
            )
        );
    }
    displayRecentMedia();
}

function displayRecentMedia() {
    recentPosts.forEach((post, index) => {
        const postCard            = document.createElement('div');
        const postCardHeader      = document.createElement('div');
        const postCardPicture     = document.createElement('div');
        const postCardLikes       = document.createElement('div');
        const postCardDescription = document.createElement('div');
        const prefix = 'post-card';

        postCard.className            = `${prefix}`;
        postCardHeader.className      = `${prefix}__header`;
        postCardPicture.className     = `${prefix}__picture`;
        postCardLikes.className       = `${prefix}__likes`;
        postCardDescription.className = `${prefix}__description`;

        const avatar           = document.createElement('img');
        const usernameLocation = document.createElement('div');
        const username         = document.createElement('div');
        const location         = document.createElement('div');
        const timeAgo          = document.createElement('div');

        avatar.classList.add('img-round', 'img-profile');
        usernameLocation.className = 'username-location';
        username.className = 'username';
        location.className = 'location';
        timeAgo.className = 'time-ago';

        avatar.src = post.avatar;
        username.innerText = post.author;
        location.innerText = post.location;
        timeAgo.innerText = post.timeAgo;

        usernameLocation.appendChild(username);
        usernameLocation.appendChild(location);
        postCardHeader.appendChild(avatar);
        postCardHeader.appendChild(usernameLocation);
        postCardHeader.appendChild(timeAgo);

        const picture = document.createElement('img');
        picture.className = 'img-post';
        picture.src = post.picture;
        postCardPicture.appendChild(picture);

        const heart = document.createElement('span');
        const likesCount = document.createElement('span');
        heart.className = 'heart';
        heart.innerHTML = '&#9825; ';
        heart.addEventListener('click', () => {
            alert(`Id записи: ${post.id}`);
        });
        likesCount.innerText = post.likesCount;
        postCardLikes.appendChild(heart);
        postCardLikes.appendChild(likesCount);

        postCardDescription.innerText = post.caption;

        postCard.appendChild(postCardHeader);
        postCard.appendChild(postCardPicture);
        postCard.appendChild(postCardLikes);
        postCard.appendChild(postCardDescription);

        const colElems = document.getElementsByClassName('col');
        const colElem = colElems[index % colElems.length];
        colElem.appendChild(postCard);
    });
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

function createBasicStructure(colCount) {
    while (document.querySelector('.col')) {
        document.querySelector('.col').remove();
    }

    for (let i = 0; i < colCount; i++) {
        let col = document.createElement('div');
        let script = document.querySelector('script');
        col.className = 'col';
        document.body.insertBefore(col, script);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < globalSettings.display.widthMedium) {
        globalSettings.display.colCount = 1;
    } else if (window.innerWidth < globalSettings.display.widthLarge) {
        globalSettings.display.colCount = 2;
    } else {
        globalSettings.display.colCount = 3;
    }
    createBasicStructure(globalSettings.display.colCount);

    const user = new User(691623);
    const src = user.getRecentMediaUrl(globalSettings);
    if (src) {
        addScript(src);
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < globalSettings.display.widthMedium) {
        if (globalSettings.display.colCount !== 1) {
            globalSettings.display.colCount = 1;
            createBasicStructure(globalSettings.display.colCount);
            displayRecentMedia();
        }
    } else if (window.innerWidth < globalSettings.display.widthLarge) {
        if (globalSettings.display.colCount !== 2) {
            globalSettings.display.colCount = 2;
            createBasicStructure(globalSettings.display.colCount);
            displayRecentMedia();
        }
    } else {
        if (globalSettings.display.colCount !== 3) {
            globalSettings.display.colCount = 3;
            createBasicStructure(globalSettings.display.colCount);
            displayRecentMedia();
        }
    }
});