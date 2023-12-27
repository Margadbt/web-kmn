let currentQuestionIndex = 0;
const questionsPerPage = 5;
const responses = [];

async function loadNextQuestion() {
  try {
    const quizContainer = document.getElementById("quiz-container");
    const radioButtons = document.getElementsByTagName("input");

    const apiUrl = `https://api.jsonbin.io/v3/b/6578dbe7266cfc3fde680095`;

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
      alert("Quiz completed!");
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

        console.log(`Letter chunk ${i / chunkSize + 1}: ${summary}`);
        resultsBySummary[j] = summary;
      }

      var finalResult = "";
      // Assign the letters for results
      resultsBySummary[0] > 0 ? (finalResult += "E") : (finalResult += "I");
      resultsBySummary[1] > 0 ? (finalResult += "S") : (finalResult += "N");
      resultsBySummary[2] > 0 ? (finalResult += "T") : (finalResult += "F");
      resultsBySummary[3] > 0 ? (finalResult += "J") : (finalResult += "P");
      finalResult += "-";
      resultsBySummary[4] < 0 ? (finalResult += "T") : (finalResult += "A");

      console.log(finalResult);

      const resultBody= {
        "result": finalResult
      }

      fetch('/api/mbti/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultBody),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.status;
      })
      .then(data => {
        console.log('sucessfullly:', data);
        // location.reload();
      })
      .catch(error => {
        console.error('Error', error);
      });
    }

    currentQuestionIndex = endQuestionIndex;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  function getOverallResponses() {
    return responses;
  }
}

loadNextQuestion();
