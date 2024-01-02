const mbtiResult = sessionStorage.getItem("mbtiResult");

class Profile {
  constructor() {}

  async Init() {
    try {
      const name = document.getElementById("profile-name");
      const mbti = document.getElementById("profile-mbti");
      const email = document.getElementById("profile-email");

      const response = await fetch("/user");
      if (response.status !== 200) {
        name.innerText = "Нэвтрээгүй";
        return;
      }

      const user = await response.json();
      name.innerText = user.fullname;
      email.innerText = user.email;
      mbti.innerText = user.mbti_result;
    } catch (error) {
      console.log(error);
    }
  }
}

const profile = new Profile();
profile.Init();
