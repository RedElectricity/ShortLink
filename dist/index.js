(() => {
  // node_modules/itty-router/dist/itty-router.min.mjs
  function e({ base: t = "", routes: n = [] } = {}) {
    return { __proto__: new Proxy({}, { get: (e2, a, o) => (e3, ...r) => n.push([a.toUpperCase(), RegExp(`^${(t + e3).replace(/(\/?)\*/g, "($1.*)?").replace(/(\/$)|((?<=\/)\/)/, "").replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3").replace(/\.(?=[\w(])/, "\\.").replace(/\)\.\?\(([^\[]+)\[\^/g, "?)\\.?($1(?<=\\.)[^\\.")}/*$`), r]) && o }), routes: n, async handle(e2, ...r) {
      let a, o, t2 = new URL(e2.url);
      e2.query = Object.fromEntries(t2.searchParams);
      for (var [p, s, u] of n)
        if ((p === e2.method || "ALL" === p) && (o = t2.pathname.match(s))) {
          e2.params = o.groups;
          for (var c of u)
            if (void 0 !== (a = await c(e2.proxy || e2, ...r)))
              return a;
        }
    } };
  }

  // node_modules/nanoid/index.browser.js
  var nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63;
    if (byte < 36) {
      id += byte.toString(36);
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte > 62) {
      id += "-";
    } else {
      id += "_";
    }
    return id;
  }, "");

  // index.js
  var router = e();
  router.get("/", () => {
    return new Response(fetch("/page/index.html").text, {
      headers: {
        "content-type": "text/html;charset=UTF-8"
      }
    });
  });
  router.post("/api/addLink", async (request) => {
    var url;
    var expiration;
    if (request.headers.get("Content-Type") === "application/json") {
      rawRequest = await request.json();
      url = rawRequest["url"];
      expiration = rawRequest["expiration"];
    }
    linkId = nanoid();
    if (expiration == -1) {
      await env.LinkDatabase.put(linkId, url);
    } else {
      await env.LinkDatabase.put(linkId, url, { expiration });
    }
    const returnData = JSON.stringify({
      "linkId": linkId
    });
    return new Response(returnData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  });
  router.all(":linkId", ({ params }) => {
    let linkId2 = decodeURIComponent(params.linkId);
    const rawLink = env.LinkDatabase.get(linkId2);
    if (rawLink == null) {
      return new Response(fetch("/page/404.html").text, {
        headers: {
          "content-type": "text/html;charset=UTF-8"
        }
      });
    }
    return new Response.redirect(rawLink);
  });
  addEventListener("fetch", (e2) => {
    e2.respondWith(router.handle(e2.request));
  });
})();
//# sourceMappingURL=index.js.map
