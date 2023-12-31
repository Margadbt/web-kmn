export const skeletonLoading = () => {
    document.getElementById("groups").innerHTML =
      '<div class="loading-skeleton-group"></div>';
    
    document
      .getElementById("posts")
      .insertAdjacentHTML(
        "beforeend",
        '<div class="loading-skeleton-post"></div>'
      );
    document.getElementById(
      "group-name"
    ).innerHTML = `<div class="loading-skeleton"></div>`;
  }
export const skeletonLoadingStop = () => {
    document.getElementById("groups").innerHTML = "";
    document.querySelector(".loading-skeleton-post").style.display = "none";
    document.getElementById("group-name").innerHTML = ``;
}