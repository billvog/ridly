# How does our consumer work?

Our consumer's architecture, for the hunt game, is heavily inspired by [Venueless](https://github.com/venueless/venueless), which is an open source, online event hosting application built with Django and Django Channels.

As explained in this [DjangoCon presentation video](https://youtu.be/NdRB9-Xtl9M), the WebSocket receives requests as an array, which looks like this:

```
-> [COMMAND, ID, PAYLOAD]
```

Where `COMMAND` is an identifier for a function, that is called to handle the request. For example, if the `COMMAND` is `hunt.cl.current`, `hunt.modules.HuntModule.get_current_clue`, which is decorated with `@command('cl.current')`, gets called. The `@command` decorator registers this function to handle that specific command. Everything under `hunt.` is handled by the HuntModule.

`ID` is an identifier set by the client, so, when we respond, they know for what request this response is.

And `PAYLOAD` is the data to pass to the handler function, that's specified by `COMMAND`.

The request is processed, and we respond with:

```
<- ["success", ID, RESULT]
```

if everything goes to plan, or:

```
<- ["error", ID, MESSAGE]
```

if it does not.

## Modules

A module, is a class that handles a specific part of the game.

For now, we only handle the game logic, but later, we could implement a live chat, that players can talk to each other, or some other real-time feature that needs WebSockets to function.

Instead of using multiple consumers to handle all the different parts, we use multiple modules and a single consumer. Again, that's inspired by [Venueless](https://github.com/venueless/venueless).
