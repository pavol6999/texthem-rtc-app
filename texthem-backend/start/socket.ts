/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'

Ws.namespace('/')
  .connected(({ socket }) => {
    console.log('new websocket connection: ', socket.id)
  })
  .disconnected(({ socket }, reason) => {
    console.log('websocket disconnecting: ', socket.id, reason)
  })
  .on('hello', ({ socket }, msg: string) => {
    console.log('websocket greeted: ', socket.id, msg)
    return 'hi'
  })

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
  // .middleware('channel') // check if user can join given channel
  .on('loadMessages', 'MessageController.loadMessages')
  .on('addMessage', 'MessageController.addMessage')
