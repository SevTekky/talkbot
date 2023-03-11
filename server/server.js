import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

// to be able to use the dotenv variables i write the following line
dotenv.config()


/*now i will get started with the configuration,
 i will create a function that  accepts an object where i simply need to pass an API key */
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//now i will create an instance of openai
const openai = new OpenAIApi(configuration);

//now i will initialize my express application (backend framework)
const app = express();

//now i will set up a few middlewares
app.use(cors()); //this will allow me to make cross-origin requests and allow server to be called from the frontend
app.use(express.json()); //this allows me to pass Json from the frontend to the backend
/*now i will create a dummy root route, it'll be an asynchronous function, 
that's going to accept a requests and a response, and it returns a greeting  */
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Greetings, from TalkBot',
    })
})

/*now i will create an 'app.post' route. I use post instead of get, because it gives me a payload, 
with get i cant really recieve as much data from the frontend.
Now i can get the data from the body/payload of the frontend request. I will wrap everything in a 'try' and 'catch' block,
and then i will get the prompt, and then i will create a response or get a response from the openAPI..
createCompletion is a function that accepts objects, in which we can pass many different things,
to which i will pass the parameters from openai text-davinci-003 model*/
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`, //it's being passed from the frontend, remember, the textArea contains data for our prompt
        temperature: 0, //higher temp value means the model will take more risks, but in this case we dont want that, we want it to answer with what it knows so we set it from 0.7 to 0
        max_tokens: 3000, //this is max number of token to generate in a completion, i'll set it to 3000 from the default 64, meaning it will give us long responses
        top_p: 1,
        frequency_penalty: 0.5, //if set to 0, this means it will not repeat similar sentences at all, i set to 0.5 so that it is less likely to repeat
        presence_penalty: 0, 
        });
//once we get a response, we want to send it back to the frontend by saying the following 
        res.status(200).send({
            bot: response.data.choices[0].text
        });
        //in the catch block, if something goes wrong we can print our error so we know what happened 
    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something has gone wrong');
    }
})

//now i must make sure that my server always listen for new requests by doing the following
// '() => ' this is a callback function
/*in the package.Json file i remove the default test script and replaced it with a new script called server,
 where i call a command called 'nodemon server' whenever i call that script,
 also i added a 'type' equal to 'module' which allows us to use imports instead of regular old required statements,
 and i removed the '"main": "index.js",' because it might conflict the index.js from the server */

app.listen(5173, () => console.log('AI Server started on http://localhost:5173'));

