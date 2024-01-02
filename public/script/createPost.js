export async function createPost(group_id ,groupName) {
    try {
      const response = await fetch("/user");
      if(response.status == 401){
        // alert("Нэвтрээгүй байна");
        window.location.href = '/login';
        return;
      }
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
        group_id: group_id,
        group_name: groupName,
        description: description,
        like_count: 0,
        comment_count: 0,
        username: user.fullname,
      };
  
      fetch("/api/community/post/create", {
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
        })
        .catch((error) => {
          console.error("Error creating post:", error);
        });
    } catch (error) {
      console.log(error.status);
      // if(error.status)
    }
  }
  