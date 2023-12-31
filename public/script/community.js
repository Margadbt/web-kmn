import { createPost } from './createPost.js';
import { skeletonLoading, skeletonLoadingStop } from './skeletonLoading.js';

class Community {
  constructor() {}

  async Init() {
    try {
      skeletonLoading();
      document.querySelector(".write-post").style.display = "none";

      const groupResponse = await fetch("/api/community/groups");
      const groups = await groupResponse.json();

      let htmlGroups = '';
      for (const group of groups) {
        const groupOBJ = new Group(group);
        htmlGroups += groupOBJ.Render();
      }

      skeletonLoadingStop();
      document.getElementById("group-name").innerText = "Newsfeed";

      document.getElementById("groups").insertAdjacentHTML("afterbegin", htmlGroups);

      const groupLinks = document.querySelectorAll(".group-preview");

      groupLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const groupId = link.dataset.groupId;
          window.dispatchEvent(new CustomEvent("groupClicked", { detail: { groupId } }));
        });
      });

      const postBtn = document.querySelector(".write-post-post-btn");
      postBtn.addEventListener("click", () => {
        const groupId = window.currentGroupId; // Use a property to store the current group_id
        if (groupId) {
          createPost(groupId);
        } else {
          console.error("Group ID is not available.");
        }
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

    <div class="group-preview" data-group-id="${this.group_id}">
      <div class="group-preview-icon">
        <img src="public/assets/icons/group.svg" />
      </div>
      <div class="group-preview-right">
        <h4 class="group-preview-name">${this.name}</h4>
      </div>
    </div>
    `;
  }
}

var com = new Community();
com.Init();

window.addEventListener("groupClicked", (event) => {
  window.currentGroupId = event.detail.groupId;
});
