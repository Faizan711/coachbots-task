async function loadExternalModule() {
    try {
      // Dynamically import the module
      const { DeepChat } = await import(
        "https://unpkg.com/deep-chat@1.3.21/dist/deepChat.bundle.js"
      );
    } catch (error) {
      console.error("Error loading external module:", error);
    }
  }
  
  // Call the function to load and use the external module
  loadExternalModule().then(() => {
    let deepChatPocElement =
      document.getElementsByClassName("deep-chat-poc")?.[0];
    deepChatPocElement.innerHTML = `
  <div class="chat-wrapper">
    <button
      type="button"
      onclick="openChatContainer()"
      class="chat-icon-container"
      style="
        height: 3rem;
        width: 3rem;
        background-color: white;
        box-shadow: 0px 0px 10px rgb(125, 125, 125);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 2rem;
        bottom: 2rem;
        cursor: pointer;
        border-top-width: 0px;
        border-right-width: 0px;
        border-bottom-width: 0px;
        border-left-width: 0px;
      "
    >
      <img
        class="chat-icon"
        style="height: 50%; width: 50%"
        src="https://raw.githubusercontent.com/Vibencode-Solutions/deepchat-poc-assets/main/chatbot.png"
        alt="chat-bot-image"
      />
    </button>
  </div>
  
  <div
    class="chat-container"
    style="
      position: absolute;
      scale: 0;
      bottom: 5rem;
      width: 300px;
      right: 5.5rem;
      transition: 0.4s ease-in-out;
      transform-origin: 100% 100%;
      padding-bottom: 0.8rem;
      border-radius: 1rem 1rem 0rem 1rem;
      box-shadow: 0px 0px 10px rgb(196, 196, 196);
      background-color: white;
    "
  >
    <h2
      class="chat-heading"
      style="
        margin-bottom: 0.4rem;
        border-bottom: 2px solid gainsboro;
        padding: 1rem;
      "
    >
      Deep Chat
    </h2>
    <deep-chat
      id="chat-element"
      microphone="true"
      demo="true"
      style="border: none"
      introMessage='{"text": "Use the microphone button or drop a file to attach it to the next outgoing message. Enter JGPGX to start the QnA session"}'
      >
    </deep-chat>
  </div>
  `;

  //OLD CODE
  
    // const chatElementRef = document.getElementById("chat-element");
    // chatElementRef.request = {
    //   handler: (body, signals) => {
    //     try {
    //       if (body instanceof FormData) {
    //         const formData = body;
    //         const audio_file = formData.get("files");
  
    //         const formData2 = new FormData();
    //         formData2.append("file", audio_file);
    //         formData2.append("model", "whisper-1");
  
    //         const url = "https://api.openai.com/v1/audio/transcriptions";
    //         const headers = {
    //           Authorization:
    //             "Bearer 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",
    //           // "Content-Type": "multipart/form-data",
    //         };
    //         fetch(url, {
    //           method: "POST",
    //           headers: headers,
    //           body: formData2,
    //         })
    //           .then((res) => {
    //             return res.json();
    //           })
    //           .then((data) => {
    //             signals.onResponse({ text: data.text });
    //           })
    //           .catch((err) => {
    //             console.log(err);
    //           });
    //       } else {
    //         //check if user has entered the code
    //         if(body.messages[0].text === 'JGPGX'){
    //             signals.onResponse({ text: "Question 1: What is your favorite color?" });
    //             signals.onResponse({ text: "Question 2: Where are you from?" });
    //             signals.onResponse({ text: "Question 3: What is your name?" });
    //         }
    //         else{
    //             signals.onResponse({ text: "Sample response!" });
    //         }
    //       }
    //     } catch (e) {
    //       signals.onResponse({ error: "Error" }); // displays an error message
    //     }
    //   },
    // };


//NEW CODE WITH QNA SESSION (NON-ASYNCHRONOUS)


// const chatElementRef = document.getElementById("chat-element");
// const questions = ["What is your favorite color?", "What is your favorite food?", "What is your favorite movie?"]; //3 random questions 
// let questionIndex = 0; 
// let transcript = ""; // the result which will be shown to user after QnA is completed.
// let inSession = false; // to check is session going on or not.

// chatElementRef.request = {
//   handler: (body, signals) => {
//     try {
//       if (body instanceof FormData) {
//         const formData = body;
//         const audio_file = formData.get("files");

//         const formData2 = new FormData();
//         formData2.append("file", audio_file);
//         formData2.append("model", "whisper-1");

//         const url = "https://api.openai.com/v1/audio/transcriptions";
//         const headers = {
//           Authorization: "Bearer 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",
//         };
        
//         fetch(url, {
//           method: "POST",
//           headers: headers,
//           body: formData2,
//         })
//           .then((res) => {
//             return res.json();
//           })
//           .then((data) => {
//             if (inSession) {
//             //store each question and its transcribed answer one by one.
//               transcript += `Q${questionIndex + 1}: ${questions[questionIndex]}, A${questionIndex + 1}: ${data.text}\n`; 
//               //increase index for next question
//               questionIndex++;

//               if (questionIndex < questions.length) {
//                 signals.onResponse({ text: questions[questionIndex] });
//               } else {
//                 signals.onResponse({ text: `### Thank you for your responses.\n` + "Here is the transcript of our conversation:\n" + transcript});
//                 // signals.onResponse({ text: "Here is the transcript of our conversation:\n" + transcript });
//                 inSession = false;  //setting session false

//                 //resetting items for next session of QnA
//                 questionIndex = 0;
//                 transcript = "";

//               }
//             } else {
//               signals.onResponse({ text: data.text });
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       } else if (body.messages[0].text === "JGPGX") { //checks the message is QnA code or not
//         inSession = true;
//         signals.onResponse({ text: questions[questionIndex] });
//       } else {
//         signals.onResponse({ text: "Sample response!" });
//       }
//     } catch (e) {
//       signals.onResponse({ error: "Error" }); // displays an error message
//     }
//   },
// };




//CODE WITH QNA SESSION (ASYNCHRONOUS)


const chatElementRef = document.getElementById("chat-element");
const questions = ["What is your favorite color?", "What is your favorite food?", "What is your favorite movie?"];
let questionIndex = 0;
let transcript = "";
let inSession = false;

function transcribeAudio(audio_file) { //I separated transcribe function to perform asynchronously from rest of code
  return new Promise((resolve, reject) => {
    const formData2 = new FormData();
    formData2.append("file", audio_file);
    formData2.append("model", "whisper-1");

    const url = "https://api.openai.com/v1/audio/transcriptions";
    const headers = {
      Authorization: "Bearer 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",
    };
    
    fetch(url, {
      method: "POST",
      headers: headers,
      body: formData2,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        resolve(data.text);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

chatElementRef.request = {
  handler: (body, signals) => {
    try {
      if (body instanceof FormData) {
        const formData = body;
        const audio_file = formData.get("files");

        if (inSession) {
          transcribeAudio(audio_file)
            .then((transcription) => {
                //store each question and its transcribed answer one by one.
              transcript += `Q${questionIndex + 1}: ${questions[questionIndex]}, A${questionIndex + 1}: ${transcription}\n`;
              //increase index for next question
              questionIndex++;

              if (questionIndex < questions.length) {
                signals.onResponse({ text: questions[questionIndex] });
              } else {
                signals.onResponse({ text: `### Thank you for your responses.\n` + "Here is the transcript of our conversation:\n" + transcript});
                inSession = false;
                // Reset for next session
                questionIndex = 0;
                transcript = "";
              }
            })
            .catch((err) => {
              signals.onResponse({ text: "An error occurred while processing the audio." });
            });
        } else {
          transcribeAudio(audio_file)
            .then((transcription) => {
              signals.onResponse({ text: transcription });
            })
            .catch((err) => {
              signals.onResponse({ text: "An error occurred while processing the audio." });
            });
        }
      } else if (body.messages[0].text === "JGPGX") { //checks the message is QnA code or not
        inSession = true;
        signals.onResponse({ text: questions[questionIndex] });
      } else {
        signals.onResponse({ text: "Sample response!" });
      }
    } catch (e) {
      signals.onResponse({ error: "Error" }); // displays an error message
    }
  },
};



  });
  
  const openChatContainer = () => {
    let chatContainer = document.getElementsByClassName("chat-container")?.[0];
    let chatIcon = document.getElementsByClassName("chat-icon")?.[0];
  
    if (chatContainer.style.scale === "1") {
      chatContainer.style.scale = 0;
      chatContainer.style["transform-origin"] = "100% 100%";
    } else {
      chatContainer.style.scale = 1;
      chatContainer.style["transform-origin"] = "100% 50%";
    }
  
    if (
      chatIcon.src ===
      "https://raw.githubusercontent.com/Vibencode-Solutions/deepchat-poc-assets/main/chatbot.png"
    ) {
      chatIcon.src =
        "https://github.com/Vibencode-Solutions/deepchat-poc-assets/blob/main/close.png?raw=true";
    } else {
      chatIcon.src =
        "https://raw.githubusercontent.com/Vibencode-Solutions/deepchat-poc-assets/main/chatbot.png";
    }
  };