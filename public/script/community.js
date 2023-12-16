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
        
        htmlPosts += `<kmn-post id="${post.id}" userId="${post.userId}" description="${post.description}" likeCount="${post.likeCount}" photoURL="${post.photoURL}" groupName="${groupName}"></kmn-post>`;
      }
      document
        .getElementById("posts")
        .insertAdjacentHTML("beforeend", htmlPosts);
      if(id>0){
        let gname = groups.find(g => g.id == id);
        document.getElementById("group-name").innerText = gname.name;
        document.querySelector(".group-info-right").innerHTML = `<button class="group-info-leave-button"><img src="/public/assets/icons/group.svg" />Группээс гарах</button>`;
      }
      else{
        document.getElementById("group-name").innerText = "Newsfeed";        
      }

      } catch (error) {
        console.error(error);
      }
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
