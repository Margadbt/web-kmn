import { updateCommentCount } from "./updateCommentCount.js"
export const createComment = async ( post_id ) =>{
    try{
        const response = await fetch("/user");
          if(response.status == 401){
            // alert("Нэвтрээгүй байна");
            window.location.href = '/login';
            return;
          }
          const user = await response.json();
  
          const commentInput = document.querySelector(".write-comment-input");
          const description = commentInput.value;
          const jsTimestamp = Date.now();

const datenow = new Date(jsTimestamp).toISOString();
    
        const dataBody = {
            "post_id": parseInt(post_id),
            "user_id": user.user_id,
            "username": user.fullname,
            "description": description,
            "date": datenow
          }
          console.log(dataBody);
          
          fetch(`api/community/post/comment/create/${post_id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataBody),
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
            })
            .catch((error) => {
              console.error("Error creating post:", error);
            });
            updateCommentCount(post_id);
    }catch(error){
        console.log(error);
    }
}