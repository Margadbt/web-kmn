import { createComment } from "../../script/createComment.js";
class KmnCommentInput extends HTMLElement {
    constructor() {
        super();
        this.post_id = this.getAttribute("post_id");

        this.innerHTML = `
        <div class="write-comment card">
            <div class="write-comment-left">
              <img class="pfp" src="public/assets/pfp.png" />
              <textarea
                class="write-comment-input"
                placeholder="What's on your mind"
                type="text"
              ></textarea>
            </div>
            <div class="write-comment-right">
              <!-- <img
                class="write-comment-group-icon"
                alt="image"
                src="/public/assets/icons/img.svg"
              /> -->
              <button class="write-comment-btn">Comment</button>
            </div>
        </div>
        `
    }

    connectedCallback() {
        const commentBtn = this.querySelector(".write-comment-btn");
        commentBtn.addEventListener("click", ()=>{
          createComment(this.post_id);
        })
    }

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

}

window.customElements.define('kmn-comment-input', KmnCommentInput);