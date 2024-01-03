import { createPost } from "./createPost.js";
import { skeletonLoading, skeletonLoadingStop } from "./skeletonLoading.js";

class Community {
  constructor() {}

  async Init() {
    try {
      skeletonLoading();

      const groupResponse = await fetch("/api/community/groups");
      const groups = await groupResponse.json();

      let htmlGroups = "";
      for (const group of groups) {
        const groupOBJ = new Group(group);
        htmlGroups += groupOBJ.Render();
      }

      skeletonLoadingStop();
      document.getElementById("group-name").innerText = "Community хэсэг";
      document.getElementById("group-description").innerText =
        "Community нь та өөрийн сонирхолоо бусадтай хуваалцах харилцан яриа хэлэлцээр үүсгэх ямар нэгэн зүйлсийн талаар ярилцах боломжтой талбар юм.";

      document
        .getElementById("groups")
        .insertAdjacentHTML("afterbegin", htmlGroups);

      const groupLinks = document.querySelectorAll(".group-preview");

      groupLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const groupId = link.dataset.groupId;
          const groupName = link.dataset.groupName;
          window.dispatchEvent(
            new CustomEvent("groupClicked", { detail: { groupId, groupName } })
          );
        });
      });

      const userResponse = await fetch("/user");
      const user =
        userResponse.status === 200 ? await userResponse.json() : null;
      document.getElementById("mini-profile-name").innerText =
        user?.fullname || "Нэвтрээгүй";
      document.getElementById("mini-profile-mbti").innerText =
        user?.mbti_result || "";

      const postBtn = document.querySelector(".write-post-post-btn");
      postBtn.addEventListener("click", () => {
        const groupId = window.currentGroupId; // Use a property to store the current group_id
        const groupName = window.currentGroupName; // Use a property to store the current group_id
        if (groupId && groupName) {
          createPost(groupId, groupName);
        } else {
          console.error("Group ID is not available.");
        }
      });

      const groupToggleBtn = document.getElementById("group-toggle");
      groupToggleBtn.addEventListener("click", () => {
        if (document.querySelector(".right-nav").style.display == "none") {
          document.querySelector(".right-nav").style.display = "inline";
        } else {
          document.querySelector(".right-nav").style.display = "none";
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
    this.group_name = group.name;
  }

  Render() {
    return `

    <groups>
      <div slot="group-name" class="group-preview" data-group-id="${this.group_id}" data-group-name="${this.group_name}">
        <div class="group-preview-icon">
          <img src="public/assets/icons/group.svg" />
        </div>
        <div class="group-preview-right">
          <h4 class="group-preview-name">${this.group_name}</h4>
        </div>
      </div>
    </groups>
    `;
  }
}

var com = new Community();
com.Init();

window.addEventListener("groupClicked", (event) => {
  window.currentGroupId = event.detail.groupId;
  window.currentGroupName = event.detail.groupName;
});
