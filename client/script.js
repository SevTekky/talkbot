import bot from './assets/bot.svg'
import user from './assets/user.svg'

/*imported icons from our assets folder
we must now target HTML elements manually since we are not using reactJS
for this we use the document.QuerySelector , calling it as a function giving the ID the name 'form'
and we will pass the ID selector which is a '#' and we'll name it chat_container just like in the HTML file 
*/

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

//this next line will be a variable we fill later on, for now we simply wanted to declare it in our outer scope

let loadInterval;

/*also, later on in the code we will also have a function that is going to load our msgs,
which is why this next line will be usefull, it's going to take in an element and it's going
to return something which is our loader, simply returning the three dots when the user is waiting for a response  */

function loader(element) {
          /* next line simply makes the element.textContent equal to an empty string
        this is simplyto ensure that it is empty at the start */
    element.textContent = '';

    /* then we are going to set the loadInterval to be equal to setInterval,
    which is a function that accepts another callback function,
    and as the second parameter it accepts a number of milliseconds, so every 300ms we want
    to do something. What do we want to do though? 
    We want to add another dot to that element text content    */
    loadInterval = setInterval(() => {
    element.textContent += '.';

/* if the loading indicator has reached three dots we want to reset it, so we write this next line making it 
    reset once it reaches the fourth dot which doesn't actually exist, so it resets to an empty string,
   this is going to repeat every 300ms, which explains the following line of code */
      if (element.textContent === '....') {
        element.textContent = '';
    }
  }, 300);
}
//this next function accepts the element and the text as parameters
function typeText(element, text) {
  //at the start, the index is going to be set to 0
let index = 0;
/*now we want to create another interval,
the 2nd parameter this time is going to be only 20ms for each letter,
and inside of there we want to check if index is lower than text.length, then it means we are still typing
and if we are still typing we can set the element.innerHTML to the following*/

let interval = setInterval(() => {
  if (index < text.length) {
    //this is going to get the char under a specific index in the text that the a.i is going to return
    element.innerHTML += text.charAt(index)
    //now we want to increment that index
    index++
    //or else if we reached that end of the text then we want to clear the interval
    } else { 
    clearInterval(interval);
    //at this point, we can type, text and load the A.I's answers
    }
  } , 20)
}
/* we will also later on, have to generate a unique ID for every single msg, to be able to map over them*/

/*in js we generate a unique ID by using the current time and date, which is always unique, using a built in JS function
  to make it even more random, we can use a built in math JS function to get a random number
  we can make it even more random by creating a hexadecimal string
  and then finally, we can return a unique and random ID */
function generateUniqueID() {
const timestamp = Date.now();
const randomNumber = Math.random();
const hexadecimalString = randomNumber.toString(16);

return `id-${timestamp}-${hexadecimalString}`;
}
/* When the chat goes from user to A.I and the field of text goes from lighter grey to darker grey,
this is the chat stripe, in which,
 each msg has an icon displaying either user or A.I, and of course it also contains a msg.
 We will now implement the chat stripe by creating a function, this function takes a few parameters,
 such as; is the A.I speaking or is it us? We're going to get the value of the msg as well,
 and were going to pass it a unique ID */

 function chatStripe(isAi, value, uniqueID) {
  /*this function is going to return a template String, this is because with regular strings you cant create spaces or enters,
   however with template strings, you can */
   return (

    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src=${isAi ? bot : user}
              alt="${isAi ? 'bot' : 'user'}" 
          />
        </div>
        <div class="message" id=${uniqueID}>${value}</div>
      </div>
    </div>
    `
   ) 
   /*this block of code that precedes this comment, is the implementation of our chat stripe,
   -----------> alt = "${isAi ? 'bot' : 'user'}"  <------------ this is a dynamic block of code that reads 'if is Ai then bot otherwise user' */
 }
 /*we will now create our handle submit
 function which is going to be the trigger to get the A.I generated response, it will be an async function,
  and it's going to take an event as the first and only parameter. 
  Also, the default browser behavior for when you submit a form is to reload the browser, however,
   we don't want this, so we use the function 'e.preventDefault(); to prevent the deault behavior of the browser  */

   const handleSubmit = async (e) => {
e.preventDefault()
//now we want to get the data that we typed into the form

const data = new FormData(form);
/*this form is simply a form element from witHin our HTML, refer to 'const form = document.querySelector('form');' 
which is where we targeted the form manually. 
Now, we want to generate a new chat stripe*/

/*user's chatstripe, first parameter set to false as it is  not the A.i but rather it is user, 
then we pass the data which is going to be a prompt. Finally we want to clear the text area input, so we do that by typing form.Reset */
chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

form.reset();

/*bot's chatstripe, first we want to generate a unique for it's msg,
and then as we created a chat stripe for ourselves, we also want to create a chat stripe for the A.i,
since it's the A.i that will be typing, we will set the parameter to 'true',
and for the second parameter we want a string with an empty space because we will fill it up later on as we are loading the actual message
(refer to the earlier code with the loadInterval and 300ms , etc.  in this script), and finally;
for the third parameter we will provide it with a unique ID */

const uniqueID = generateUniqueID();
chatContainer.innerHTML += chatStripe(true, " ", uniqueID);

//now, if the user is going to type, we want to keep scrolling down to view that msg, the following line of code puts that new msg in view

chatContainer.scrollTop = chatContainer.scrollHeight;
//now we want to fetch this newly created Div. It's important that we created a new unique ID for every single message, and finally, we turn on the loader
const messageDiv = document.getElementById(uniqueID);

loader(messageDiv);

// fetch the data from server -> bot's response
//we  simply need to create a new response
// IMPORTANT NOTE TO SELF, WHEN I CHANGE FROM HTTPS TO HTTP, MY LOADER DISSAPEARS, IT RE-APPEARS ONLY WHEN ON HTTPS
// the header is going to be an object containing Content-type
//finally, we have to pass our valubale body, and we pass in an object where we say 'data.get('prompt')'
//which is our data or msg coming from our text area element on the screen
const response = await fetch('https://talkbot-4wlm.onrender.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
      })
    })
    //since we dont know which point in the loading we are currently at, at the point where we fetch, for eg we may be at one dot, two dots..
  //   we want to clear it to be empty for us to be able to add our msg 
clearInterval(loadInterval)
messageDiv.innerHTML = '';

if (response.ok) {
  const data = await response.json(); //this gives  me the actual response coming from the backend
  const parsedData = data.bot.trim(); //this is how to parse it 

  

  typeText(messageDiv, parsedData) //this is how to pass it to the typeText function which i created before
} else {
  const err = await response.text()

  messageDiv.innerHTML = "Something has gone wrong"
  alert(err);
    }

}
/* to see the changes we made to our handleSubmit, we have to somehow call it right? So below the handleSubmit, we'll say  */
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})


/*it's a listener for a submit event, and once we submit, we want to call the handleSubmit function 
and for developers we like to hit enterwhen submitting forms, so for this we write the following (note, 'keyup' is when we press and enter the 'enter' key,
following that part we want to call the callback function, where we can check if e.keyCode is = to thirteen, which is the 'enter' key, 
and then we can handle the submit.
Now I will create a backend application that will make a call to the openAI chatgpt API by creating a new server folder in the client directory,
then i will ctrl+c in the terminal to stop the client from running, then i will 'cd ..' to move a directory up,
then i will 'cd .\server\' to move into the server directory, finally i will run 'npm init iy'
this will generate a new package.json file inside of our server, then i need to install a couple dependencies,
that i will be using for the server side application, by running 'npm install cors dotenv express nodemon openai'  
cors is used for cross origin requests, dotenv is used for secure environment variables, express has a backend framework,
nodemon keeps our application running when we implemnent changes.  Upon installing, all dependencies will be installed in the package.json file
-where will i write that server side code to make calls to openai? I will create a server.js,
and i will do all the setup and configuration to be able to call the openai's API. However i need my API key from openai.com/api
 */


