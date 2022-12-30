import { Router } from 'itty-router'
import { nanoid } from "nanoid";

// Create a new router
const router = Router()

/*
Our index route, a simple hello world.
*/
router.get("/", () => {
  return new Response(fetch("/page/index.html").text, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  })
})

router.post("/api/addLink", async request => {
  var url
  var expiration

  if (request.headers.get("Content-Type") === "application/json") {
    rawRequest = await request.json()
    url = rawRequest["url"]
    expiration = rawRequest["expiration"]
  }

  linkId = nanoid()

  if (expiration == -1) {
    await env.LinkDatabase.put(linkId, url)
  } else {
    await env.LinkDatabase.put(linkId, url, {expiration: expiration})
  }

  const returnData = JSON.stringify({
    "linkId": linkId
  })

  return new Response(returnData, {
    headers: {
      "Content-Type": "application/json"
    }
  })
})

router.all(":linkId", ({ params }) => {
  // Decode text like "Hello%20world" into "Hello world"
  let linkId = decodeURIComponent(params.linkId)

  const rawLink = env.LinkDatabase.get(linkId)
  
  if (rawLink == null) {
    return new Response(fetch("/page/404.html").text, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    })
  }
  return new Response.redirect(rawLink)
})



addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})
