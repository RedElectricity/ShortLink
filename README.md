# ShortLink

# Installion

First, install wrangler
```
npm install wrangler
```

Next, new a KV ,modify the `wrangler.toml`
```
kv_namespaces = [
  { binding = "LinkDatabase", id = "Here is your KV Id" }
]
```

Finally, publish it
```
wrangler publish 
```

