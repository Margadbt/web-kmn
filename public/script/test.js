let currentQuestionIndex = 0;
const questionsPerPage = 5;
const responses = [];
let mbtiResult = "";

// function checkSessionStorage() {
//   mbtiResult = sessionStorage.getItem("mbtiResult");

//   if (mbtiResult) {
//     showSaveOption();
//   } else {
//     loadNextQuestion();
//   }
// }

// function showSaveOption() {
//   const quizContainer = document.getElementById("quiz-container");
//   const saveButton = document.getElementById("save-button");

//   saveButton.style.display = "block";

//   quizContainer.innerHTML = `
//     <p>You've already completed the test. Your result: ${mbtiResult}</p>
//     <button onclick="saveResults()">Save Result</button>
//   `;
// }

async function loadNextQuestion() {
  try {
    const quizContainer = document.getElementById("quiz-container");
    const radioButtons = document.getElementsByTagName("input");

    // const apiUrl = `https://api.jsonbin.io/v3/b/6578dbe7266cfc3fde680095`;
    const apiUrl = `https://api.jsonbin.io/v3/b/65823fd41f5677401f10955c`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const questions = data.record.questions;

    const startQuestionIndex = currentQuestionIndex;
    const endQuestionIndex = Math.min(
      currentQuestionIndex + questionsPerPage,
      questions.length
    );

    function combineResponses(selectedValues) {
      responses.push(...selectedValues);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (startQuestionIndex < endQuestionIndex) {
      let questionHTML = "";
      let qCount = 0; // Question name counter

      for (let i = startQuestionIndex; i < endQuestionIndex; i++, qCount++) {
        const currentQuestion = questions[i];
        questionHTML += `
              <fieldset class="">
                <legend class="question">${currentQuestion.question}</legend>
                <div class="group_options">
                  <div aria-hidden="true" class="agree">
                    Agree
                  </div>
                  <div id="radios">
                    <label class="container">
                      <input name="radio-${qCount}" type="radio" value="-3"/>
                      <span class="chosen very"></span>  
                    </label>
                    <label class="container">
                      <input name="radio-${qCount}" type="radio" value="-2"/>
                      <span class="chosen more"></span>  
                    </label>
                    <label class="container">
                      <input name="radio-${qCount}" type="radio" value="-1"/>
                      <span class="chosen slight"></span>  
                    </label>
                    <label class="container">
                      <input name="radio-${qCount}" type="radio" value="0"/>
                      <span class="chosen neutral"></span>  
                    </label>
                    <label class="container">
                      <input name="radio-${qCount}" type="radio" value="1"/>
                      <span class="chosen slight"></span>  
                    </label>
                    <label class="container">
                      <input name="radio-${qCount}" type="radio" value="2"/>
                      <span class="chosen more"></span>  
                    </label>
                    <label class="container">
                      <input name="radio-${qCount}" type="radio" value="3"/>
                      <span class="chosen very"></span>  
                    </label>
                  </div>
                  <div aria-hidden="false" class="disagree">
                    Disagree
                  </div>
                </div>
              </fieldset>
            `;
      }

      const selectedValues = Array.from(radioButtons)
        .map((radio) => ({
          originalValue: radio.value,
          checked: radio.checked,
        }))
        .filter((obj) => obj.checked)
        .map((obj) => obj.originalValue);

      combineResponses(selectedValues);

      quizContainer.innerHTML = questionHTML;
    } else {
      // alert("Quiz completed!");

      const selectedValues = Array.from(document.getElementsByTagName("input"))
        .map((radio) => ({
          originalValue: radio.value,
          checked: radio.checked,
        }))
        .filter((obj) => obj.checked)
        .map((obj) => obj.originalValue);

      combineResponses(selectedValues);
      console.log(responses);

      // Assign results by chunk summary
      const chunkSize = 12;

      var resultsBySummary = [],
        j = 0;

      for (let i = 0; i < responses.length; i += chunkSize, j++) {
        const chunk = responses.slice(i, i + chunkSize);

        const summary = chunk.reduce(
          (sum, value) => sum + parseInt(value, 10),
          0
        );

        // console.log(`Letter chunk ${i / chunkSize + 1}: ${summary}`);
        resultsBySummary[j] = summary;
      }

      // Assign the letters for results
      resultsBySummary[0] > 0 ? (mbtiResult += "E") : (mbtiResult += "I");
      resultsBySummary[1] > 0 ? (mbtiResult += "S") : (mbtiResult += "N");
      resultsBySummary[2] > 0 ? (mbtiResult += "T") : (mbtiResult += "F");
      resultsBySummary[3] > 0 ? (mbtiResult += "J") : (mbtiResult += "P");
      mbtiResult += "-";
      resultsBySummary[4] < 0 ? (mbtiResult += "T") : (mbtiResult += "A");

      console.log(mbtiResult);
      sessionStorage.setItem("mbtiResult", mbtiResult);

      const notificationPopup = document.getElementById("notification-popup");
      const resultsDisplay = document.getElementById("results-display");
      const quizBody = document.getElementById("quiz");
      const notNowBtn = document.getElementsByClassName("NotnowBtn");

      const userId = await getUserId();

      if (userId) {
        console.log("Session Logged in");
        window.location.href = "/profile";
        notNowBtn.textContent = "Save Results";
        return;
      }
      resultsDisplay.textContent = `${mbtiResult}`;

      notificationPopup.style.display = "flex";
      quizBody.style.display = "none";
    }

    currentQuestionIndex = endQuestionIndex;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  function getOverallResponses() {
    return responses;
  }
}

function registerToSave() {
  // Redirect to register
  sessionStorage.setItem("mbtiResult", mbtiResult);
  console.log(
    "mbti result have been stored in the session through registration!"
  );
  closeNotificationPopup();
  window.location.href = "/register";
}
async function loginToSave() {
  // Redirect to login
  const mbtiResult = sessionStorage.getItem("mbtiResult");

  if (!mbtiResult) {
    console.error("MBTi Result not found in sessionStorage");
    return;
  }

  try {
    const userId = await getUserId();

    if (!userId) {
      // console.error("User ID not found");
      console.log("Session Not Logged in");
      window.location.href = "/login";
      return;
    }

    const apiUrl = "api/mbti/result/change";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mbti_result: mbtiResult,
        user_id: userId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // return response.json();
        return response.status;
      })
      .then((data) => {
        console.log("Result change successful:", data);
        closeNotificationPopup();
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error during result change:", error);
      });
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
}

async function getUserId() {
  try {
    const response = await fetch("/user");
    if (response.status !== 200) {
      console.error("Error fetching user ID");
      return null;
    }

    const user = await response.json();

    if (!user || typeof user.user_id !== "number") {
      console.error("User ID not found or not an integer in the response");
      return null;
    }

    console.log("Fetched user ID");
    return user.user_id;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}

function closeNotificationPopup() {
  const notificationPopup = document.getElementById("notification-popup");
  const quizBody = document.getElementById("quiz");

  notificationPopup.style.display = "none";
  quizBody.style.display = "none";
}

loadNextQuestion();
