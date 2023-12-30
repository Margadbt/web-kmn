export class KmnComment extends HTMLElement {
    constructor(comment_id) {
        super();
        this.username = this.getAttribute("username");
        this.description = this.getAttribute("description");
        this.date = this.getAttribute("date");
        this.innerHTML = `
        <div class="single-comment">
        <div class="author">
            <img class="pfp" src="public/assets/pfp.png" alt="profile" />
            <p class="post-username">${this.username}</p>
            </div>
        <p class="description">${this.description}</p>
        <p style="text-align: end; margin-top: 5px;">${this.date}</p>
        </div>
        `
    }

    connectedCallback() {
        //implementation
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

window.customElements.define('kmn-comment', KmnComment);