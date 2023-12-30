class PostSection extends HTMLElement {
  connectedCallback() {
    this.render([]);
    this.allpostRender();
    window.addEventListener("groupClicked", (event) => {
      const groupId = event.detail.groupId;
      document.querySelector(".write-post").style.display = "flex"
      this.fetchAndRenderPosts(groupId);
    });
  }

  render(posts, groupData) {
    let htmlPosts = ``;
    for (const post of posts) {
      const groupName = post.groupName || "Newsfeed";
      htmlPosts += `<kmn-post post_id="${post.post_id}" group_id="${post.group_id}" user_id="${post.user_id}" description="${post.description}" like_count="${post.like_count}" photo_url="${post.photo_url}" comment_count="${post.comment_count}" groupName="${groupData[0].name}"></kmn-post>`;
    }
    this.innerHTML = htmlPosts;
  }

  async allpostRender(){
    try{
        const response = await fetch(`/api/community/posts/`);
        const groupResponse = await fetch(`api/community/groups/`);
        const groupData = await groupResponse.json();
        const posts = await response.json();
        let htmlPosts = ``;
        for (const post of posts) {
        const groupName = groupData.find((item)=> post.group_id == item.group_id).name;
        htmlPosts += `<kmn-post post_id="${post.post_id}" group_id="${post.group_id}" user_id="${post.user_id}" description="${post.description}" like_count="${post.like_count}" photo_url="${post.photo_url}" comment_count="${post.comment_count}" groupName="${groupName}"></kmn-post>`;
        }
        this.innerHTML = htmlPosts;
    }catch(error){
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
      if (groupId) {
        // document.querySelector(
        //   ".group-info-right"
        // ).innerHTML = `<button class="group-info-leave-button"><img src="/public/assets/icons/group.svg" />Группээс гарах</button>`;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define("kmn-post-section", PostSection);
