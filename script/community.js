// const data = [
//     {
//         "id": 1,
//         "category": "group",
//         "groups": [
//             {
//                 "id": 1,
//                 "name": "MBTI Сонирхогчид"
//             },
//             {
//                 "id": 2,
//                 "name": "Enneagram Сонирхогчид"
//             },
//             {
//                 "id": 3,
//                 "name": "Temprament Сонирхогчид"
//             },
//             {
//                 "id": 4,
//                 "name": "Meme"
//             },
//             {
//                 "id": 5,
//                 "name": "Mental Health"
//             }
//         ]
//     },
//     {
//         "id": 2,
//         "category": "post",
//         "posts": [
//             {
//                 "id": 1,
//                 "userId": 1,
//                 "groupId": 1,
//                 "description": "MBTI",
//                 "likeCount": 0,
//                 "photoURL": "/assets/post-pic.jpg"
//             },
//             {
//                 "id": 2,
//                 "userId": 2,
//                 "groupId": 2,
//                 "description": "Enneagram",
//                 "likeCount": 2,
//                 "photoURL": "/assets/post-pic.jpg"
//             }
//         ]
//     }
// ];

const params = new URLSearchParams(document.location.search);
const id = params.get("id");
console.log(params)
class Community{
    constructor(){

    }
    async Init() {
        try {
          const response = await fetch("https://api.jsonbin.io/v3/b/654a5b3012a5d376599624d7");
          const datasa = await response.json();
          const data = datasa.record;
    
          // Postuud
          const posts = data[1].posts;
          //All posts
          if(params.size == 0){
            
            let htmlPosts = ``;
            for (const post of posts) {
                const pos = new Post(post);
                htmlPosts += pos.Render();
            }
            document.querySelector(".posts").insertAdjacentHTML("beforeend", htmlPosts);
            document.getElementById("group-name").innerText = "Бүх постууд"
          } else{
                //paramGroup posts
                const filteredPosts = posts.filter(post => post.id ==  id);
                let htmlPosts = ``;
                    for (const post of filteredPosts) {
                        const pos = new Post(post);
                        htmlPosts += pos.Render();
                    }
                document.querySelector(".posts").insertAdjacentHTML("beforeend", htmlPosts);

                let obj = null;
                for(const obje of data[0].groups){
                    if(obje.id == id){
                        obj = obje;
                        break;
                    }
                }
                document.getElementById("group-name").innerText = obj.name
                
          }
          

          // Groupuud
          const groups = data[0].groups;
          let htmlGroups = ``;
          for (const group of groups) {
            const gro = new Group(group);
            htmlGroups += gro.Render();
          }
          document.getElementById("your-groups").insertAdjacentHTML("beforeend", htmlGroups);
          document.getElementById("rec-groups").insertAdjacentHTML("beforeend", htmlGroups);
          //-----------
        } catch (error) {
          console.error(error);
        }
    }   
}

class Post{
    constructor(post){
        this.id = post.id;
        this.userId = post.userId;
        this.groupId = post.groupId;
        this.description = post.description;
        this.likeCount = post.likeCount;
        this.photoURL = post.photoURL;
    }
    Render(){
        return  `
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

class Group{
    constructor(group){
        this.id = group.id;
        this.name = group.name;
    }

    Render(){
        return `
            <li><a href="?id=${this.id}">${this.name}</a></li>
        `
    }
}


var com = new Community();
com.Init();