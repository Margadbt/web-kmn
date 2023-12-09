//URL aas parameter awah
const params = new URLSearchParams(document.location.search);
const id = params.get("id");

class Community {
  constructor() {}
  async Init() {
    try {
      let response, data, posts;
      if (id) {
        response = await fetch(`/api/posts/${id}`);
        posts = await response.json();
      } else {
        response = await fetch(`/api/posts`);
        data = await response.json();
        posts = data.posts;
      }

      let htmlPosts = ``;
      for (const post of posts) {
        const pos = new Post(post);
        htmlPosts += pos.Render();
      }
      document
        .querySelector(".posts")
        .insertAdjacentHTML("afterbegin", htmlPosts);
      document.getElementById("group-name").innerText = "Бүх постууд";

      // Groupuud
      const gresponse = await fetch("http://localhost:4000/api/groups");
      const gData = await gresponse.json();
      const groups = gData.groups;
      let htmlGroups = ``;
      for (const group of groups) {
        const gro = new Group(group);
        htmlGroups += gro.Render();
      }
      document
        .getElementById("your-groups")
        .insertAdjacentHTML("afterbegin", htmlGroups);
      document
        .getElementById("rec-groups")
        .insertAdjacentHTML("afterbegin", htmlGroups);
    } catch (error) {
      console.error(error);
    }
  }
}

class Post {
  constructor(post) {
    this.id = post.id;
    this.userId = post.userId;
    this.groupId = post.groupId;
    this.description = post.description;
    this.likeCount = post.likeCount;
    this.photoURL = post.photoURL;
  }
  Render() {
    return `
        <article class="card">
            <div class="author">
                <img class="pfp" src="${this.photoURL}" alt="profile">
                <p>${this.userId}</p>
            </div>
            <p>${this.description}</p>
            <img class="psp" src="${this.photoURL}" alt="post picture">
            <div class="reactions">
                <img class="like" src="../assets/heart-126.svg" alt="like">
                <p>${this.likeCount}</p>
            </div>
        </article>
        `;
  }
}

class Group {
  constructor(group) {
    this.id = group.id;
    this.name = group.name;
  }

  Render() {
    return `
            <li><a href="?id=${this.id}">${this.name}</a></li>
        `;
  }
}

var com = new Community();
com.Init();
