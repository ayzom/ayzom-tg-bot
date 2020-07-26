const TELEGRAM_TOKEN = '1185112566:AAFIVS0shDMJPWLwbfKnLWyZAk7kMm1QooU';

addEventListener('fetch', event => {
  const { request } = event
  const { url } = request
  if (url.includes('form')) {
    return event.respondWith(rawHtmlResponse(someForm))
  }
  if (url.includes('submission')) {
    return event.respondWith(getFormResponse(event))
  }
  if (request.method === 'POST') {
    return event.respondWith(handleRequest(request))
  } else if (request.method === 'GET') {
    return event.respondWith(new Response(`The request was a GET`))
  }
})

async function getFormResponse(event) {
    const formData = await event.request.formData()
    const body = {}
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }
  return await shortbot(body);
}

async function handleRequest(request) {
  const reqBody = await readRequestBody(request)
  console.log(reqBody);
  //const retBody = `The request body sent in was ${reqBody}`
  return await shortbot(reqBody);
  //return new Response(reqBody)
}

/**
 * rawHtmlResponse delivers a response with HTML inputted directly
 * into the worker script
 * @param {string} html
 */
function rawHtmlResponse(html) {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }
  return new Response(html, init)
}
/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {

  const { headers } = request
  const contentType = headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return (await request.json())
    //return JSON.stringify(await request.json())
  }
  else if (contentType.includes('application/text')) {
    return await request.text()
  } else if (contentType.includes('text/html')) {
    return await request.text()
  } else {
    const myBlob = await request.blob()
    const objectURL = URL.createObjectURL(myBlob)
    return objectURL
  }
}
const someForm = `
  <!DOCTYPE html>
  <html>
  <body>
  <h1>Hello World</h1>
  <p>This is all generated using a Worker</p>
  <form action="/submission" method="post">
    <div>
      <label for="name">Name?</label>
      <input name="name" id="name" value="Akhilesh">
    </div>

    <div>
      <label for="say">What  do you want to say?</label>
      <input name="message" id="say" value="Hi">
    </div>
    <div>
      <label for="to">To who?</label>
      <input name="_replyto" id="to" value="Mom">
    </div>
    <div>
      <button>Send my greetings</button>
    </div>
  </form>
  </body>
  </html>
  `

async function sendToUser(chat_id, text) {
  const uri = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  const options = {
    'method': 'post',
    'headers': {
      'Content-type': 'application/json'
    },
    'body': JSON.stringify({
      'chat_id': chat_id,
      'text': text
    })
  }
  const httpResponse = await fetch(uri, options);
  return httpResponse;
}


async function shortbot(event) {

  const body = (event);

  if ((body._replyto)) {
    let text = body.name;
    let chat = {
      id: "198940317"
    }
   await sendToUser(chat.id, JSON.stringify(body));
  } else {
    let { chat, text } = body.message;
    await sendToUser(chat.id, text);
  }

  const res = {
    status: "OK"
  }
  return new Response(JSON.stringify(res), {
    headers: { 'content-type': 'text/plain',
      "Access-Control-Allow-Origin": '*'
     },
    status: 200
  })
};





