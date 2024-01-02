async function register(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const mbtiResult = sessionStorage.getItem("mbtiResult");

  try {
    const response = await fetch("/user/register", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        mbti_result: mbtiResult,
      }),
    });

    if (!response.ok) {
      const errorHTML = `<p style="color: red; text-align: center;">Registration failed</p>`;
      document
        .querySelector(".card")
        .insertAdjacentHTML("afterbegin", errorHTML);

      console.log(response);
      return;
    }
    console.log("i mean it at least loading");
    window.location.href = "/login";
  } catch (error) {
    console.error("Error during registration:", error);
  }
}
