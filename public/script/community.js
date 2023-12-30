import { createPost } from './createPost.js';
import { skeletonLoading, skeletonLoadingStop } from './skeletonLoading.js';
class Community {
  constructor() {}
  
  async Init() {
    try {
      skeletonLoading();
      document.querySelector(".write-post").style.display = "none"

      const groupResponse = await fetch("/api/community/groups");
      const groups = await groupResponse.json();

      let htmlGroups = ``;
      for (const group of groups) {
        const groupOBJ = new Group(group);
        htmlGroups += groupOBJ.Render();
      }
      skeletonLoadingStop();
      document.getElementById("group-name").innerText = "Newsfeed";

      document
        .getElementById("your-groups")
        .insertAdjacentHTML("afterbegin", htmlGroups);
      document
        .getElementById("rec-groups")
        .insertAdjacentHTML("afterbegin", htmlGroups);

      let response, data, posts;

      response = await fetch(`/api/community/posts`);
      data = await response.json();
      posts = data;


      const groupLinks = document.querySelectorAll(".group-link");

      

      groupLinks.forEach((link) => {
        link.addEventListener("click", async (event) => {
          event.preventDefault();
          const groupId = link.dataset.groupId;
          window.dispatchEvent(
            new CustomEvent("groupClicked", { detail: { groupId } })
          );
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
}

class Group {
  constructor(group) {
    this.group_id = group.group_id;
    this.name = group.name;
  }

  Render() {
    return `
            <div class="group-link" data-group-id="${this.group_id}">${this.name}</div>
        `;
  }
}

var com = new Community();
com.Init();

const postBtn = document.querySelector(".write-post-post-btn");
postBtn.addEventListener("click", createPost);