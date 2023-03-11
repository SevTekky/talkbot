I used Render.com to deploy the backend servr which is running on localhost:5173 . 
For the Front-end, I used Vercel for deployment. 
If Internal Server Error 500 appears in the Browser debugging console; my fix was that; 
I went back into the server directory and ran 'npm start server' to make sure the server was running. It must be running in order for Render.com to use it for deployment.
Also, I made sure in my client folder (frontend), to run 'npm run dev' to start the nodejs server on the frontend; to be safe.

Make sure that your OPENAI API KEY doesn't get leaked, or else OPENAI will email you they will cycle your keys. For this fix, 
You make sure that when you commit and push your files to github, that your '.env' folder is pushed along with it, because it contains your API keys. 
OPENAI detects this and will email you immediately upon the push to github if your .env file is not hidden. You must run 'git rm --cached .env' if you
pushed your keys to github by accident. It will remove the file from github that was pushed and from there your would get a new KEY from OPENAI, plug that in your
.env file replacing the old one, then you would print to the terminal your api key to inform the nodejs server of it by adding 'console.log(process.env.OPENAI_API_KEY)'
under the 'dotenv.config();' line of code in the server.js file. Once this is done, and you run the server and it displays the API keys to your terminal,
you can remove the console.log line of code that i just mentioned, and you can then update this new api Key to render.com in the Environment variables section.

Make sure that your frontend and backend are running on the same ports and not different ports.
