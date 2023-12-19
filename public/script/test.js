// Define a function to create the radio group component
function createRadioGroup(questionText, options, containerId) {
  // Create the legend element
  const legend = document.createElement("legend");
  legend.classList.add("sr-only");
  legend.innerHTML = `<span class="statement text-center">${questionText}</span>`;
  fieldset.appendChild(legend);

  // Create the group options container
  const groupOptions = document.createElement("div");
  groupOptions.classList.add("group__options");

  // Iterate through options and create radio inputs
  options.forEach((option, index) => {
    const inputId = `radio_${containerId}_${index}`;
    const input = `<fieldset class="">
              <!-- Render the question and options dynamically -->
              <legend class="question">${currentQuestion.question}</legend>
              <div class="group_options">
                <div aria-hidden="true" class="agree">
                  Agree
                </div>
                <div id="radios">
                  <label class="container">
                    <input name="radio" type="radio" value="-3"/>
                    <span class="chosen very"></span>  
                  </label>
                  <label class="container">
                    <input name="radio" type="radio" value="-2"/>
                    <span class="chosen more"></span>  
                  </label>
                  <label class="container">
                    <input name="radio" type="radio" value="-1"/>
                    <span class="chosen slight"></span>  
                  </label>
                  <label class="container">
                    <input name="radio" type="radio" value="0"/>
                    <span class="chosen neutral"></span>  
                  </label>
                  <label class="container">
                    <input name="radio" type="radio" value="1"/>
                    <span class="chosen slight"></span>  
                  </label>
                  <label class="container">
                    <input name="radio" type="radio" value="2"/>
                    <span class="chosen more"></span>  
                  </label>
                  <label class="container">
                    <input name="radio" type="radio" value="3"/>
                    <span class="chosen very"></span>  
                  </label>
                </div>
                <div aria-hidden="false" class="disagree">
                  Disagree
                </div>
              </div>
            </fieldset>`;
    groupOptions.innerHTML += input;
  });

  // Append elements to the fieldset
  fieldset.appendChild(groupOptions);

  // Append the fieldset to the specified container
  const container = document.getElementById(containerId);
  container.appendChild(fieldset);
}

// Example usage
const questionText = "You regularly make new friends.";
const options = [
  { label: "I strongly agree", value: "-3" },
  { label: "I moderately agree", value: "-2" },
  { label: "I agree", value: "-1" },
  { label: "I am not sure", value: "0" },
  { label: "I disagree", value: "1" },
  { label: "I moderately disagree", value: "2" },
  { label: "I strongly disagree", value: "3" },
];

// Specify the container ID where the component should be added
const containerId = "start-quiz";

// Create the radio group component
createRadioGroup(questionText, options, containerId);
