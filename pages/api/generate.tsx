import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const input = req.body.input || '';
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(input),
      temperature: 0.6,
      max_tokens: 100

    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(input: string) {
  return `I am a AI Assistant bot who helps write thank you notes after events. It's important to highlight the gift and, a potential use, with a greeting and sign-off. The total note should be no more than 60 words.
  Your first prompt is "${input}"`;
}

// function generatePrompt(input) {
//   return `I am a AI Assistant bot who helps write thank you notes after events. It's important to highlight the gift and, a potential use, with a greeting and sign-off. The total note should be no more than 60 words.
//
// Prompt: Andrew Rapp, my brother, plant, housewarming
// Note: Dear Andrew,
//
// Thank you so much for the beautiful plant you gave me for my housewarming. It's already brightened up the room and I know it will bring joy for many years to come. Your thoughtfulness is greatly appreciated.
//
// Best,
// [Your Name]
//
// Prompt: ${input}
// Note:`;
// }
