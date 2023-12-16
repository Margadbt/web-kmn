class Post extends HTMLElement {
    constructor() {
        super();
        this.userId = this.getAttribute('userId');
        this.description = this.getAttribute('description');
        this.likeCount = parseInt(this.getAttribute('likeCount')) || 0;
        this.photoURL = this.getAttribute('photoURL');
        this.id = this.getAttribute('id');
        this.groupName = this.getAttribute('groupName');

        this.innerHTML = `
        <article class="card">
            <div class="author">
                <img class="pfp" src="public/assets/pfp.png" alt="profile">
                <p class="post-username">${this.userId}</p>
                <p>•</p>
                <a href="?group=${this.groupId}" class="post-group-name">${this.groupName}</a>
            </div>
            <p class="post-desc">${this.description}</p>
            ${this.photoURL ? `<img class="psp" src="${this.photoURL}" alt="post picture"></img>` : ''}
            
            <div class="reactions">
                <div class="likes">
                    <img class="heart-icon" src="public/assets/icons/heart.svg" alt="like">
                    <img class="another-icon" src="public/assets/icons/heartA.svg" alt="another">
                    <p class="like-count">${this.likeCount}</p>
                </div>
                <div class="comment">
                    <img class="comment-icon" src="public/assets/icons/comment.svg" alt="comment">
                    <p class="comment-count">2</p>
                </div>
            </div>
        </article>
        `;
    }

    connectedCallback() {
        const likesDiv = this.querySelector('.likes');
        const heartIcon = this.querySelector('.heart-icon');
        const heartActivated = this.querySelector('.another-icon');
        const likeCountElement = this.querySelector('.like-count');

        let isLiked = false;
        
        heartActivated.style.display = 'none';

        likesDiv.addEventListener('click', () => {
            // Toggle the like state
            isLiked = !isLiked;

            if (isLiked) {
                heartIcon.style.display = 'none';
                heartActivated.style.display = 'inline-block';
                this.likeCount += 1;
            } else {
                heartIcon.style.display = 'inline-block';
                heartActivated.style.display = 'none';
                this.likeCount -= 1;
            }

            likeCountElement.textContent = this.likeCount;
        });
    }
}

customElements.define("kmn-post", Post);
