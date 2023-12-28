//URL aas parameter awah
const params = new URLSearchParams(document.location.search);
const id = params.get("group");

class Community {
  constructor() {}
  skeletonLoading(){
    document.getElementById("your-groups").innerHTML =
    '<div class="loading-skeleton-group"></div>';
  document.getElementById("rec-groups").innerHTML =
    '<div class="loading-skeleton-group"></div>';
  document.getElementById("posts").insertAdjacentHTML("beforeend", '<div class="loading-skeleton-post"></div>')
    document.getElementById("group-name").innerHTML = 
    `<div class="loading-skeleton"></div>`;
  }
  skeletonLoadingStop(){
    document.getElementById("your-groups").innerHTML =
    '';
  document.getElementById("rec-groups").innerHTML =
    '';
    document.querySelector(".loading-skeleton-post").style.display = "none";
    document.getElementById("group-name").innerHTML = 
    ``;
  }
  async Init() {
    try {
      this.skeletonLoading();
      

      const gresponse = await fetch("/api/community/groups");
      const gData = await gresponse.json();
      const groups = gData;

      let htmlGroups = ``;
      for (const group of groups) {
        const gro = new Group(group);
        htmlGroups += gro.Render();
      }
      this.skeletonLoadingStop();
      document
        .getElementById("your-groups")
        .insertAdjacentHTML("afterbegin", htmlGroups);
      document
        .getElementById("rec-groups")
        .insertAdjacentHTML("afterbegin", htmlGroups);

      let response, data, posts;
      console.log(id);

      if (id) {
        response = await fetch(`/api/community/posts/group/${id}`);
        posts = await response.json();
      } else {
        response = await fetch(`/api/community/posts`);
        data = await response.json();
        posts = data;
        document.querySelector(".write-post").style.display="none";
        // if (writePostElement) {
        //   writePostElement.style.display = "none";
        // }
      }

      let htmlPosts = ``;
      for (const post of posts) {
        let ggname = groups.find((g) => g.group_id == post.group_id);
        const groupName = ggname.name;
        console.log(post);
        htmlPosts += `<kmn-post post_id="${post.post_id}" group_id="${post.group_id}" user_id="${post.user_id}" description="${post.description}" like_count="${post.like_count}" photo_url="${post.photo_url}" comment_count="${post.comment_count}" groupName="${groupName}"></kmn-post>`;
      }
      document
        .getElementById("posts")
        .insertAdjacentHTML("beforeend", htmlPosts);
      if (id > 0) {
        let gname = groups.find((g) => g.group_id == id);
        document.getElementById("group-name").innerText = gname.name;
        document.querySelector(
          ".group-info-right"
        ).innerHTML = `<button class="group-info-leave-button"><img src="/public/assets/icons/group.svg" />Группээс гарах</button>`;
      } else {
        document.getElementById("group-name").innerText = "Newsfeed";
      }
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
            <li><a href="?group=${this.group_id}">${this.name}</a></li>
        `;
  }
}

var com = new Community();
com.Init();

const postBtn = document.querySelector(".write-post-post-btn");
// postBtn.addEventListener("click", createPost());

async function createPost() {
  try {
    const response = await fetch("/user");
    const user = await response.json();

    console.log("hi");
    const postInput = document.querySelector(".write-post-input");
    const description = postInput.value;

    if (!description.trim()) {
      alert("Post хоосон байна!");
      return;
    }

    const postData = {
      user_id: user.user_id,
      group_id: id,
      description: description,
      like_count: 0,
      photo_url: "",
      comment_count: 0,
      username: user.fullname,
    };

    fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.status;
      })
      .then((data) => {
        console.log("Post created successfully:", data);
        location.reload();
        // You can also update your UI or do other actions after successful post creation
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        // Handle errors, show an alert, etc.
      });
  } catch (error) {
    console.log("Not Authorized");
  }
}
