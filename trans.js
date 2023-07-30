// // const fs = require("fs");
// // const fetch = require("node-fetch");

// // const { Configuration, OpenAIApi } = require("openai");

// // const API_TOKEN = "e1feba3ea0cd4255b423b8d60818367b";
// // const OPENAI_API_KEY = "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"; // Replace with your OpenAI API key
// // const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

// // async function getGrammarFeedback(text) {
// //   try {
// //     const prompt = `Review the following text for grammatical errors and suggest improvements:\n\n"${text}"`;

// //     const response = await openai.complete({
// //       model: "text-davinci-002",
// //       prompt: prompt,
// //       maxTokens: text.length + 100,
// //     });

// //     return response.data.choices[0].text.trim();
// //   } catch (error) {
// //     console.error(`Error with OpenAI API: ${error.message}`);
// //     return null;
// //   }
// // }

// // async function upload_file(api_token, path) {
// //   const data = fs.readFileSync(path);
// //   const url = "https://api.assemblyai.com/v2/upload";

// //   try {
// //     const response = await fetch(url, {
// //       method: "POST",
// //       body: data,
// //       headers: {
// //         "Content-Type": "application/octet-stream",
// //         Authorization: api_token,
// //       },
// //     });

// //     if (response.status === 200) {
// //       const responseData = await response.json();
// //       return responseData["upload_url"];
// //     } else {
// //       console.error(`Error: ${response.status} - ${response.statusText}`);
// //       return null;
// //     }
// //   } catch (error) {
// //     console.error(`Error: ${error}`);
// //     return null;
// //   }
// // }

// // async function transcribeAudio(api_token, audio_url) {
// //   const headers = {
// //     authorization: api_token,
// //     "content-type": "application/json",
// //   };

// //   const response = await fetch("https://api.assemblyai.com/v2/transcript", {
// //     method: "POST",
// //     body: JSON.stringify({ audio_url }),
// //     headers,
// //   });

// //   const responseData = await response.json();
// //   const transcriptId = responseData.id;
// //   const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

// //   while (true) {
// //     const pollingResponse = await fetch(pollingEndpoint, { headers });
// //     const transcriptionResult = await pollingResponse.json();

// //     if (transcriptionResult.status === "completed") {
// //       return transcriptionResult;
// //     } else if (transcriptionResult.status === "error") {
// //       throw new Error(`Transcription failed: ${transcriptionResult.error}`);
// //     } else {
// //       await new Promise((resolve) => setTimeout(resolve, 3000));
// //     }
// //   }
// // }

// // async function main() {
// //   const path = "./recorded.wav";
// //   const uploadUrl = await upload_file(API_TOKEN, path);

// //   if (!uploadUrl) {
// //     console.error(new Error("Upload failed. Please try again."));
// //     return;
// //   }

// //   const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
// //   console.log("Transcript:", transcript.text);

// //   const feedback = await getGrammarFeedback(transcript.text);

// //   if (feedback) {
// //     console.log("OpenAI Feedback:", feedback);
// //     fs.writeFile("./feedback.txt", feedback, (err) => {
// //       if (err) {
// //         console.error(err);
// //       }
// //       console.log("Feedback written to feedback.txt");
// //     });
// //   } else {
// //     console.error("Failed to get feedback from OpenAI.");
// //   }

// //   fs.writeFile("./test.txt", transcript.text, (err) => {
// //     if (err) {
// //       console.error(err);
// //     }
// //     console.log("Transcript written to test.txt");
// //   });
// // }

// // main();

// const API_TOKEN = "e1feba3ea0cd4255b423b8d60818367b";
// const OPENAI_API_KEY = "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";
// const fs = require("fs");
// const fetch = require("node-fetch");

// async function main() {
//   console.log("Welcome to AssemblyAI!");

//   async function upload_file(api_token, path) {
//     console.log(`Uploading file: ${path}`);
//     const data = fs.readFileSync(path);
//     const url = "https://api.assemblyai.com/v2/upload";

//     const response = await fetch(url, {
//       method: "POST",
//       body: data,
//       headers: {
//         "Content-Type": "application/octet-stream",
//         Authorization: api_token,
//       },
//     });

//     if (response.status === 200) {
//       const responseData = await response.json();
//       return responseData["upload_url"];
//     } else {
//       console.error(`Error: ${response.status} - ${response.statusText}`);
//       return null;
//     }
//   }

//   async function transcribeAudio(api_token, audio_url) {
//     const headers = {
//       authorization: api_token,
//       "content-type": "application/json",
//     };
//     const response = await fetch("https://api.assemblyai.com/v2/transcript", {
//       method: "POST",
//       body: JSON.stringify({ audio_url }),
//       headers,
//     });
//     const responseData = await response.json();
//     const transcriptId = responseData.id;
//     const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

//     while (true) {
//       const pollingResponse = await fetch(pollingEndpoint, { headers });
//       const transcriptionResult = await pollingResponse.json();

//       if (transcriptionResult.status === "completed") {
//         return transcriptionResult;
//       } else if (transcriptionResult.status === "error") {
//         throw new Error(`Transcription failed: ${transcriptionResult.error}`);
//       } else {
//         await new Promise((resolve) => setTimeout(resolve, 3000));
//       }
//     }
//   }

//   async function getOpenAIFeedback(text) {
//     //const url = "https://api.openai.com/v1/engines/davinci/completions";
//     const url = "https://api.openai.com/v1/chat/completions";

//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${OPENAI_API_KEY}`,
//     };
//     const response = await fetch(url, {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify({
//         prompt: `Given the following text, please provide corrections for grammar, clarity, and style: "${text}"`,
//         max_tokens: 50,
//       }),
//     });

//     const responseData = await response.json();
//     return (
//       responseData.choices &&
//       responseData.choices[0] &&
//       responseData.choices[0].text.trim()
//     );
//   }

//   const path = "./recorded.wav";
//   const uploadUrl = await upload_file(API_TOKEN, path);

//   if (!uploadUrl) {
//     console.error(new Error("Upload failed. Please try again."));
//     return;
//   }

//   const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
//   console.log("Original Transcript:", transcript.text);

//   const improvedText = await getOpenAIFeedback(transcript.text);
//   console.log("Improved Text:", improvedText);

//   fs.writeFile("./test.txt", improvedText, (err) => {
//     if (err) {
//       console.error(err);
//     }
//     console.log("Improved transcript written to test.txt");
//   });
// }

// main();

// const API_TOKEN = "e1feba3ea0cd4255b423b8d60818367b";
// const OPENAI_API_KEY = "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";
// const fs = require("fs");
// const fetch = require("node-fetch");

// async function main() {
//   console.log("Welcome to AssemblyAI!");

//   async function upload_file(api_token, path) {
//     console.log(`Uploading file: ${path}`);
//     const data = fs.readFileSync(path);
//     const url = "https://api.assemblyai.com/v2/upload";

//     const response = await fetch(url, {
//       method: "POST",
//       body: data,
//       headers: {
//         "Content-Type": "application/octet-stream",
//         Authorization: api_token,
//       },
//     });

//     if (response.status === 200) {
//       const responseData = await response.json();
//       return responseData["upload_url"];
//     } else {
//       console.error(`Error: ${response.status} - ${response.statusText}`);
//       return null;
//     }
//   }

//   async function transcribeAudio(api_token, audio_url) {
//     const headers = {
//       authorization: api_token,
//       "content-type": "application/json",
//     };
//     const response = await fetch("https://api.assemblyai.com/v2/transcript", {
//       method: "POST",
//       body: JSON.stringify({ audio_url }),
//       headers,
//     });
//     const responseData = await response.json();
//     const transcriptId = responseData.id;
//     const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

//     while (true) {
//       const pollingResponse = await fetch(pollingEndpoint, { headers });
//       const transcriptionResult = await pollingResponse.json();

//       if (transcriptionResult.status === "completed") {
//         return transcriptionResult;
//       } else if (transcriptionResult.status === "error") {
//         throw new Error(`Transcription failed: ${transcriptionResult.error}`);
//       } else {
//         await new Promise((resolve) => setTimeout(resolve, 3000));
//       }
//     }
//   }

// async function getOpenAIFeedback(text) {
//   const url = " https://api.openai.com/v1/completions";

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${OPENAI_API_KEY}`,
//   };
//   const response = await fetch(url, {
//     method: "POST",
//     headers: headers,
//     body: JSON.stringify({
//       prompt: `Given the following text, please provide corrections for grammar, clarity, and style: "${text}"`,
//       max_tokens: 150, // I increased the tokens limit as 50 might be too restrictive.
//     }),
//   });

//   const responseData = await response.json();

//   if (responseData.error) {
//     console.error(`OpenAI API error: ${responseData.error.message}`);
//     return null;
//   }

//   return (
//     responseData.choices &&
//     responseData.choices[0] &&
//     responseData.choices[0].text.trim()
//   );
// }

const fs = require("fs");
const fetch = require("node-fetch");
const { Configuration, OpenAIApi } = require("openai");

const API_TOKEN = "e1feba3ea0cd4255b423b8d60818367b";
const OPENAI_API_KEY = "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";

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getOpenAIFeedback(text) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `You will be provided with statements, and your task is give feedback line by line to the student on how they can improve their sentence.\nUSER\n${text}`,
        },
      ],
      temperature: 0,
      max_tokens: 256,
    });

    return (
      response.data.choices && response.data.choices[0].message.content.trim()
    );
  } catch (error) {
    console.error(`OpenAI API error: ${error.message}`);
    return null;
  }
}

async function upload_file(api_token, path) {
  console.log(`Uploading file: ${path}`);
  const data = fs.readFileSync(path);
  const url = "https://api.assemblyai.com/v2/upload";

  const response = await fetch(url, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/octet-stream",
      Authorization: api_token,
    },
  });

  if (response.status === 200) {
    const responseData = await response.json();
    return responseData["upload_url"];
  } else {
    console.error(`Error: ${response.status} - ${response.statusText}`);
    return null;
  }
}

async function transcribeAudio(api_token, audio_url) {
  const headers = {
    authorization: api_token,
    "content-type": "application/json",
  };
  const response = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    body: JSON.stringify({ audio_url }),
    headers,
  });
  const responseData = await response.json();
  const transcriptId = responseData.id;
  const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

  while (true) {
    const pollingResponse = await fetch(pollingEndpoint, { headers });
    const transcriptionResult = await pollingResponse.json();

    if (transcriptionResult.status === "completed") {
      return transcriptionResult;
    } else if (transcriptionResult.status === "error") {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

async function main() {
  console.log("Welcome to AssemblyAI!");

  const path = "./recorded.wav";
  const uploadUrl = await upload_file(API_TOKEN, path);

  if (!uploadUrl) {
    console.error(new Error("Upload failed. Please try again."));
    return;
  }

  const transcript = await transcribeAudio(API_TOKEN, uploadUrl);
  console.log("Original Transcript:", transcript.text);

  const improvedText = await getOpenAIFeedback(transcript.text);
  console.log("Improved Text:", improvedText);

  if (improvedText) {
    fs.writeFile("./test.txt", improvedText, (err) => {
      if (err) {
        console.error(err);
      }
      console.log("Improved transcript written to test.txt");
    });
  } else {
    console.error("Failed to get an improved text.");
  }
}

main();
