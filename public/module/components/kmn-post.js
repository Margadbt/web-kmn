class Post extends HTMLElement {
  constructor() {
    super();
    this.user_id = this.getAttribute("user_id");
    this.description = this.getAttribute("description");
    this.like_count = parseInt(this.getAttribute("like_count"));
    this.photo_url = this.getAttribute("photo_url");
    this.post_id = this.getAttribute("post_id");
    this.comment_count = this.getAttribute("comment_count");
    this.group_id = this.getAttribute("group_id");
    this.username = this.getAttribute("username");
    this.group_name = this.getAttribute("group_name");

    this.innerHTML = `
        <article class="card single-post">
            <div class="author">
                <img class="pfp" src="public/assets/pfp.png" alt="profile">
                <p class="post-username">${this.username}</p>
                <p>•</p>
                <p class="post-group-name">${this.group_name}</p>
            </div>
            <p class="description">${this.description}</p>
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
    const comment_button = this.querySelector(".comment");

    comment_button.addEventListener("click", ()=>{
      window.dispatchEvent(
        new CustomEvent("post-comment-clicked", { detail: { post_id: this.post_id } })
      );
    });

    let isLiked = false;

    heartActivated.style.display = "none";
    if(this.like_count > 9){
      heartIcon.style.display = "none";
      heartActivated.style.display = "inline-block";
    }

    likesDiv.addEventListener("click", () => {

      isLiked = !isLiked;
      
      // if(this.like_count>9){
      //   heartIcon.style.display = "none";
      //   heartActivated.style.display = "inline-block";
      // }

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
