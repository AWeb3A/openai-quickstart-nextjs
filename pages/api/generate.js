import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
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

function generatePrompt(car) {
  const capitalizedCar =
  car[0].toUpperCase() + car.slice(1).toLowerCase();
  return `Dame toda la informacion que tengas sobre el siguiente modelos de Autos:

  Dame informacion breve, precisa, y correcta. Solamente quisiera el dato nada mas.

Modelo: Toyota
Informacion: Del 2017 al 2022 han entrado 323,756 carros en la republica dominicana -->

Modelo: Honda
Informacion: Del 2017 al 2022 han entrado 172,733 carros en la republica dominicana -->

Modelo: Mazda
Informacion: Del 2017 al 2022 han entrado 32,949 carros en la republica dominicana -->

Modelo: ${capitalizedCar}
Informacion: 

`;
}
