//URL aas parameter awah
const params = new URLSearchParams(document.location.search);
const id = params.get("group");

class Community {
  constructor() {}
  async Init() {
    try {
      
      const gresponse = await fetch("/api/groups");
      const gData = await gresponse.json();
      const groups = gData;
      
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
        posts = data;
        document.querySelector(".write-post").style.display = "none";
      }
      

      let htmlPosts = ``;
      for (const post of posts) {
        let ggname = groups.find(g => g.groupid == post.groupid);
        const groupName = ggname.name;
        
        htmlPosts += `<kmn-post postid="${post.postid}" userId="${post.userid}" description="${post.description}" likeCount="${post.likecount}" photoURL="${post.photoURL}" commentcount="${post.commentcount}" groupName="${groupName}"></kmn-post>`;
      }
      document
        .getElementById("posts")
        .insertAdjacentHTML("beforeend", htmlPosts);
      if(id>0){
        let gname = groups.find(g => g.groupid == id);
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
    this.groupid = group.groupid;
    this.name = group.name;
  }

  Render() {
    return `
            <li><a href="?group=${this.groupid}">${this.name}</a></li>
        `;
  }
}

var com = new Community();
com.Init();

const postBtn = document.querySelector(".write-post-post-btn");
// postBtn.addEventListener("click", createPost());

function createPost() {
  console.log("hi");
  const postInput = document.querySelector(".write-post-input");
  const description = postInput.value;

  if (!description.trim()) {
    alert("Post хоосон байна!");
    return;
  }

  const postData = {
    userid: 1,
    groupid: id, 
    description: description,
    likecount: 0,
    photo: "" ,
    commentcount: 0,
  };

  fetch('/api/posts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.status;
  })
  .then(data => {
    console.log('Post created successfully:', data);
    location.reload();
    // You can also update your UI or do other actions after successful post creation
  })
  .catch(error => {
    console.error('Error creating post:', error);
    // Handle errors, show an alert, etc.
  });
}