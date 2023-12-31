export class KmnCommentSection extends HTMLElement {
    constructor(post_id) {
        super();
        this.post_id = post_id;
        this.innerHTML = `
        <div class="card">
            
            <h3 style="margin-bottom: 10px;">Сэтгэгдэлүүд:</h3>
            <div class="comments">
            
            </div>
        </div>
        `;
    }

    async connectedCallback() {
        const commentsContainer = this.querySelector(".comments");
        try {
            const response = await fetch(`/api/community/comments/${this.post_id}`);
            const results = await response.json();
            let commentHTML = ``;
            
            results?.forEach(element => {
                commentHTML += `<kmn-comment username="${element.username}" description="${element.description}" date="${element.date}"></kmn-comment>`;
            });

            commentsContainer.innerHTML = commentHTML || "Хоосон байна.";
        } catch (error) {
            console.log(error);
        }
    }

    disconnectedCallback() {
        // Implementation for cleanup or teardown if needed
    }

    attributeChangedCallback(name, oldVal, newVal) {
        // Implementation for attribute changes if needed
    }

    adoptedCallback() {
        // Implementation if the element is adopted by another document
    }
}

window.customElements.define('kmn-comment-section', KmnCommentSection);
