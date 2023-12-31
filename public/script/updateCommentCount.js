export const updateCommentCount = async (post_id) =>{
    try{
        const response = await fetch(`/api/community/post/comment/count/${post_id}`);
        const commentCount = await response.json();
        fetch(`/api/community/post/comment/update/${post_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment_count: commentCount[0].count,
            }),
        })
    }catch(error){
        console.log(error);
    }
}