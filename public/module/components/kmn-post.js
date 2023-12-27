class Post extends HTMLElement {
  constructor() {
    super();
    this.user_id = this.getAttribute("user_id");
    this.description = this.getAttribute("description");
    this.like_count = parseInt(this.getAttribute("like_count"));
    this.photo_url = this.getAttribute("photo_url");
    this.post_id = this.getAttribute("post_id");
    this.group_name = this.getAttribute("groupName");
    this.comment_count = this.getAttribute("comment_count");
    this.group_id = this.getAttribute("group_id");
    this.username = this.getAttribute("username");
    this.innerHTML = `
        <article class="card">
            <div class="author">
                <img class="pfp" src="public/assets/pfp.png" alt="profile">
                <p class="post-username">${this.user_id}</p>
                <p>•</p>
                <a href="?group=${this.group_id}" class="post-group-name">${this.group_name}</a>
            </div>
            <p class="post-desc">${this.description}</p>
            ${
              // !this.photo_url
              //   ? `<img class="psp" src="${this.photo_url}" alt="post picture"></img>`
              //   : ""
                ""
            }
            
            <div class="reactions">
                <div class="likes">
                    <img class="heart-icon" src="public/assets/icons/heart.svg" alt="like">
                    <img class="another-icon" src="public/assets/icons/heartA.svg" alt="another">
                    <p class="like-count">${this.like_count}</p>
                </div>
                <div class="comment">
                    <img class="comment-icon" src="public/assets/icons/comment.svg" alt="comment">
                    <p class="comment-count">${this.comment_count}</p>
                </div>
            </div>
        </article>
        `;
  }

  connectedCallback() {
    const likesDiv = this.querySelector(".likes");
    const heartIcon = this.querySelector(".heart-icon");
    const heartActivated = this.querySelector(".another-icon");
    const like_countElement = this.querySelector(".like-count");

    let isLiked = false;

    heartActivated.style.display = "none";

    likesDiv.addEventListener("click", () => {
      // Toggle the like state
      isLiked = !isLiked;

      if (isLiked) {
        heartIcon.style.display = "none";
        heartActivated.style.display = "inline-block";
        this.like_count += 1;
      } else {
        heartIcon.style.display = "inline-block";
        heartActivated.style.display = "none";
        this.like_count -= 1;
      }

      like_countElement.textContent = this.like_count;
    });
  }
}

customElements.define("kmn-post", Post);
