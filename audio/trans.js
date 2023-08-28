const fs = require("fs");

const { Configuration, OpenAIApi } = require("openai");

const fetch = require("node-fetch");

// assembly AI Token
 
// Open AI Token
 

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
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

async function upload_file(process.env.process.env.api_token, path) {
  console.log(`Uploading file: ${path}`);
  const data = fs.readFileSync(path);
  const url = "https://api.assemblyai.com/v2/upload";

  const response = await fetch(url, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/octet-stream",
      Authorization: process.env.process.env.api_token,
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

async function transcribeAudio(process.env.api_token, audio_url) {
  const headers = {
    authorization: process.env.api_token,
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

  const path = "./new.webm";
  const uploadUrl = await upload_file(process.env.api_token, path);

  if (!uploadUrl) {
    console.error(new Error("Upload failed. Please try again."));
    return;
  }

  const transcript = await transcribeAudio(process.env.api_token, uploadUrl);
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
