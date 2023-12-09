//URL aas parameter awah
const params = new URLSearchParams(document.location.search);
const id = params.get("group");

class Community {
  constructor() {}
  async Init() {
    try {
      
      const gresponse = await fetch("/api/groups");
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
        let ggname = groups.find(g => g.id == post.groupId);
        const groupName = ggname.name;
        const pos = new Post(post, groupName);
        htmlPosts += pos.Render();
      }
      document
        .getElementById("posts")
        .insertAdjacentHTML("beforeend", htmlPosts);
      if(id>0){
        let gname = groups.find(g => g.id == id);
        document.getElementById("group-name").innerText = gname.name;
        document.querySelector(".group-info-right").innerHTML = "<button>Группээс гарах</button>";
      }
      else{
        document.getElementById("group-name").innerText = "Бүх постууд";        
      }

      } catch (error) {
        console.error(error);
      }
  }
}

class Post {
  constructor(post, groupName) {
    this.id = post.id;
    this.userId = post.userId;
    this.groupId = post.groupId;
    this.description = post.description;
    this.likeCount = post.likeCount;
    this.photoURL = post.photoURL;
    this.groupName = groupName
  }
  Render() {
    return `
        <article class="card">
            <div class="author">
                <img class="pfp" src="${this.photoURL}" alt="profile">
                <p class="post-username">${this.userId}</p>
                <p>•</p>
                <a href="?group=${this.groupId}" class="post-group-name">${this.groupName}</a>
            </div>
            <p>${this.description}</p>
            <img class="psp" src="${this.photoURL}" alt="post picture">
            <div class="reactions">
                <img class="like" src="public/assets/heart-126.svg" alt="like">
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
            <li><a href="?group=${this.id}">${this.name}</a></li>
        `;
  }
}

var com = new Community();
com.Init();
