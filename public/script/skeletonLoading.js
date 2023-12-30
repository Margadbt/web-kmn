export const skeletonLoading = () => {
    document.getElementById("your-groups").innerHTML =
      '<div class="loading-skeleton-group"></div>';
    document.getElementById("rec-groups").innerHTML =
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
    document.getElementById("your-groups").innerHTML = "";
    document.getElementById("rec-groups").innerHTML = "";
    document.querySelector(".loading-skeleton-post").style.display = "none";
    document.getElementById("group-name").innerHTML = ``;
}