class PostSection extends HTMLElement {
  connectedCallback() {
    this.allpostRender();
    window.addEventListener("groupClicked", (event) => this.handleGroupClicked(event));
    window.addEventListener("post-comment-clicked", (event) => this.postCommentSection(event.detail.post_id));
  }

  async postCommentSection(post_id) {
    try {
      const { group_id, user_id, description, like_count, photo_url, comment_count, username } = await this.fetchPostData(post_id);
      const { name: groupName } = await this.fetchGroupData(group_id);

      this.renderPost({ post_id, group_id, user_id, description, like_count, photo_url, comment_count, groupName, username });
    } catch (error) {
      console.log(error);
    }
  }

  async allpostRender() {
    try {
      const groupData = await this.fetchGroupDataAll();
      const posts = await this.fetchAllPosts();

      this.render(posts, groupData);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAndRenderPosts(groupId) {
    try {
      const groupData = await this.fetchGroupData(groupId);
      const posts = await this.fetchPostsByGroup(groupId);

      this.render(posts, groupData);
      this.updateGroupName(groupData[0].name);
    } catch (error) {
      console.error(error);
    }
  }

  async handleGroupClicked(event) {
    const groupId = event.detail.groupId;
    document.querySelector(".write-post").style.display = "flex";
    this.fetchAndRenderPosts(groupId);
  }

  async fetchPostData(post_id) {
    const response = await fetch(`/api/community/post/${post_id}`);
    return (await response.json())[0];
  }

  async fetchGroupData(groupId) {
    const response = await fetch(`api/community/group/${groupId}`);
    return await response.json();
  }

  async fetchGroupDataAll() {
    const response = await fetch(`api/community/groups/`);
    return await response.json();
  }

  async fetchAllPosts() {
    const response = await fetch(`/api/community/posts/`);
    return await response.json();
  }

  async fetchPostsByGroup(groupId) {
    const response = await fetch(`/api/community/posts/group/${groupId}`);
    return await response.json();
  }

  render(posts, groupData) {
    const htmlPosts = posts.map(post => this.generatePostHtml(post, groupData));
    this.innerHTML = htmlPosts.join('');
  }

  renderPost(post) {
    this.innerHTML = this.generatePostHtml(post);
  }

  generatePostHtml(post, groupData) {
    const groupName = post.groupName || "Newsfeed";
    return `<kmn-post post_id="${post.post_id}" group_id="${post.group_id}" user_id="${post.user_id}" description="${post.description}" like_count="${post.like_count}" photo_url="${post.photo_url}" comment_count="${post.comment_count}" groupName="${groupName}" username="${post.username}"></kmn-post>`;
  }

  updateGroupName(name) {
    document.getElementById("group-name").innerText = name;
  }
}

customElements.define("kmn-post-section", PostSection);
