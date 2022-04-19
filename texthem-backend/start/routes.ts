/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('me', 'AuthController.me').middleware('auth')
}).prefix('auth')

Route.post('channelJoin', 'ChannelController.join').middleware('auth')
Route.post('channelCancel', 'ChannelController.cancel').middleware('auth')
Route.post('channelQuit', 'ChannelController.quit').middleware('auth')
Route.get('channelList/:name', 'ChannelController.list').middleware('auth')
Route.post('channelInvite', 'ChannelController.invite').middleware('auth')
Route.post('channelRevoke', 'ChannelController.revoke').middleware('auth')
Route.post('channelKick', 'ChannelController.kick').middleware('auth')

Route.post('inviteAccept', 'ChannelController.inviteAccept').middleware('auth')
Route.post('inviteDecline', 'ChannelController.inviteDecline').middleware('auth')