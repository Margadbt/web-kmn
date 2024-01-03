import { KmnCommentSection } from "./kmn-comment-section.js";
import { updateCommentCount } from "../../script/updateCommentCount.js";

class PostSection extends HTMLElement {
  connectedCallback() {
    document.getElementById("community").addEventListener("click", ()=>{
      localStorage.clear();
    })
    console.log(this.retrievePostsFromLocalStorage());
    window.addEventListener("groupClicked", (event) => {
      const groupId = event.detail.groupId;
      document.querySelector(".write-post").style.display = "flex";
      this.fetchAndRenderPosts(groupId);
    });
    window.addEventListener("post-comment-clicked", (event) => {
      document.querySelector(".write-post").style.display = "none";
      this.postCommentSection(event.detail.post_id);
    });
    if(this.retrievePostsFromLocalStorage()){

      this.render(this.retrievePostsFromLocalStorage());
      return
    }
    this.allpostRender();
    
  }

  async postCommentSection(post_id) {
    try {
      const response = await fetch(`/api/community/post/${post_id}`);
      const dataArray = await response.json();
      const data = dataArray[0];
      const htmlPosts = `<kmn-post post_id="${data.post_id}" group_id="${data.group_id}" group_name="${data.group_name}" user_id="${data.user_id}" description="${data.description}" like_count="${data.like_count}" photo_url="${data.photo_url}" comment_count="${data.comment_count}" username="${data.username}"></kmn-post>`;

      this.savePostsToLocalStorage(htmlPosts);

      const kmnCommentSection = new KmnCommentSection(post_id);
      this.appendChild(kmnCommentSection);
    } catch (error) {
      console.log(error);
    }
  }

  render(posts) {
    this.innerHTML = posts;
  }

  async allpostRender() {
    try {
      document.querySelector(".write-post").style.display = "none";

      const response = await fetch(`/api/community/posts/`);
      const groupResponse = await fetch(`api/community/groups/`);
      const groupData = await groupResponse.json();
      const posts = await response.json();
      let htmlPosts = "";
      for (const post of posts) {
        updateCommentCount(post.post_id);
        const groupName = groupData.find((item) => post.group_id == item.group_id).name;
        htmlPosts += `<kmn-post post_id="${post.post_id}" group_id="${post.group_id}" user_id="${post.user_id}" description="${post.description}" like_count="${post.like_count}" photo_url="${post.photo_url}" comment_count="${post.comment_count}" group_name="${post.group_name}" username="${post.username}"></kmn-post>`;
      }
      this.savePostsToLocalStorage(htmlPosts);
      this.render(htmlPosts);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAndRenderPosts(groupId) {
    try {
      const response = await fetch(`/api/community/posts/group/${groupId}`);
      const groupResponse = await fetch(`api/community/group/${groupId}`);
      const groupData = await groupResponse.json();
      const posts = await response.json();
      let htmlPosts = "";
      for (const post of posts) {
        updateCommentCount(post.post_id);
        const groupName = groupData.find((item) => post.group_id == item.group_id).name;
        htmlPosts += `<kmn-post post_id="${post.post_id}" group_id="${post.group_id}" user_id="${post.user_id}" description="${post.description}" like_count="${post.like_count}" photo_url="${post.photo_url}" comment_count="${post.comment_count}" group_name="${post.group_name}" username="${post.username}"></kmn-post>`;
      }
      this.savePostsToLocalStorage(htmlPosts);
      this.render(htmlPosts);
      document.getElementById("group-name").innerText = groupData[0].name;
      document.getElementById("group-description").innerText = groupData[0].description;
    } catch (error) {
      console.error(error);
    }
  }

  savePostsToLocalStorage(posts) {
    localStorage.setItem("savedPosts", posts);
    
  }

  retrievePostsFromLocalStorage() {
    return localStorage.getItem("savedPosts") || "";
    
  }
}

customElements.define("kmn-post-section", PostSection);
