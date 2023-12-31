import {KmnCommentSection} from "./kmn-comment-section.js";
class PostSection extends HTMLElement {
  connectedCallback() {
    this.render([]);
    this.allpostRender();
    window.addEventListener("groupClicked", (event) => {
      const groupId = event.detail.groupId;
      document.querySelector(".write-post").style.display = "flex";
      this.fetchAndRenderPosts(groupId);
    });
    window.addEventListener("post-comment-clicked", (event) => {
      document.querySelector(".write-post").style.display = "none";
      this.postCommentSection(event.detail.post_id)
    });
  }

  async postCommentSection (post_id){
    try{
      const response = await fetch(`/api/community/post/${post_id}`);
      const dataArray = await response.json();
      const data = await dataArray[0];
      const groupResponse = await fetch(`api/community/group/${data.group_id}`);
      const groupData = await groupResponse.json();
      let htmlPosts = ``;
      htmlPosts += `<kmn-post post_id="${data.post_id}" group_id="${data.group_id}" user_id="${data.user_id}" description="${data.description}" like_count="${data.like_count}" photo_url="${data.photo_url}" comment_count="${data.comment_count}" groupName="${groupData[0].name}" username="${data.username}"></kmn-post>`;
      this.innerHTML = htmlPosts;
      
      const kmnCommentSection = new KmnCommentSection(post_id);
      this.appendChild(kmnCommentSection);

    }catch(error){
      console.log(error);
    }
  }

  render(posts, groupData) {
    let htmlPosts = ``;
    for (const post of posts) {
      const groupName = post.groupName || "Newsfeed";
      htmlPosts += `<kmn-post post_id="${post.post_id}" group_id="${post.group_id}" user_id="${post.user_id}" description="${post.description}" like_count="${post.like_count}" photo_url="${post.photo_url}" comment_count="${post.comment_count}" groupName="${groupData[0].name}" username="${post.username}"></kmn-post>`;
    }
    this.innerHTML = htmlPosts;
  }

  async allpostRender() {
    try {
      const response = await fetch(`/api/community/posts/`);
      const groupResponse = await fetch(`api/community/groups/`);
      const groupData = await groupResponse.json();
      const posts = await response.json();
      let htmlPosts = ``;
      for (const post of posts) {
        const groupName = groupData.find(
          (item) => post.group_id == item.group_id
        ).name;
        htmlPosts += `<kmn-post post_id="${post.post_id}" group_id="${post.group_id}" user_id="${post.user_id}" description="${post.description}" like_count="${post.like_count}" photo_url="${post.photo_url}" comment_count="${post.comment_count}" groupName="${groupName}" username="${post.username}"></kmn-post>`;
      }
      this.innerHTML = htmlPosts;
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
      this.render(posts, groupData);
      document.getElementById("group-name").innerText = groupData[0].name;
      document.getElementById("group-description").innerText = groupData[0].description;

    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define("kmn-post-section", PostSection);
