import { createPost } from './createPost.js';
class Community {
  constructor() {}
  skeletonLoading() {
    document.getElementById("your-groups").innerHTML =
      '<div class="loading-skeleton-group"></div>';
    document.getElementById("rec-groups").innerHTML =
      '<div class="loading-skeleton-group"></div>';
    document
      .getElementById("posts")
      .insertAdjacentHTML(
        "beforeend",
        '<div class="loading-skeleton-post"></div>'
      );
    document.getElementById(
      "group-name"
    ).innerHTML = `<div class="loading-skeleton"></div>`;
  }
  skeletonLoadingStop() {
    document.getElementById("your-groups").innerHTML = "";
    document.getElementById("rec-groups").innerHTML = "";
    document.querySelector(".loading-skeleton-post").style.display = "none";
    document.getElementById("group-name").innerHTML = ``;
  }
  async Init() {
    try {
      this.skeletonLoading();
      document.querySelector(".write-post").style.display = "none"

      const groupResponse = await fetch("/api/community/groups");
      const groups = await groupResponse.json();

      let htmlGroups = ``;
      for (const group of groups) {
        const groupOBJ = new Group(group);
        htmlGroups += groupOBJ.Render();
      }
      this.skeletonLoadingStop();
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

      const postSection = document.querySelector("post-section");

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