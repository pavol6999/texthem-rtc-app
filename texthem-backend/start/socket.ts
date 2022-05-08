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
  .connected('ActivityController.onConnected')
  .disconnected('ActivityController.onDisconnected')
  .on('user:refresh', 'ActivityController.onRefresh')
  .on('user:change_notif_state', 'ActivityController.on_change_notifs')

// this is dynamic namespace, in controller methods we can use params.name
Ws.namespace('channels/:name')
  // .middleware('channel') // check if user can join given channel

  .on('loadNewMessages', 'MessageController.loadNewMessages')
  .on('loadMessages', 'MessageController.loadMessages')
  .on('addMessage', 'MessageController.addMessage')
  .on('removeChannel', 'MessageController.deleteChannel')
  .on('notify', 'MessageController.notify')
  .on('notifyLeave', 'MessageController.notifyLeave')
  .on('someoneTyping', 'MessageController.someoneTyping')
  .on('userKicked', 'MessageController.userKicked')
