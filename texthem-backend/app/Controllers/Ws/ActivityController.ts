import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'

export default class ActivityController {
  private getUserRoom(user: User): string {
    return `user:${user.id}`
  }

  public async onConnected({ socket, auth, logger }: WsContextContract) {
    // all connections for the same authenticated user will be in the room
    const room = this.getUserRoom(auth.user!)
    const userSockets = await socket.in(room).allSockets()

    // this is first connection for given user
    if (userSockets.size === 0) {
      socket.broadcast.emit('user:online', auth.user)
    }

    // add this socket to user room
    socket.join(room)
    // add userId to data shared between Socket.IO servers
    // https://socket.io/docs/v4/server-api/#namespacefetchsockets
    socket.data.userId = auth.user!.id
    await auth.user!.load('channels')
    let channels = auth.user?.channels

    let invitations: Channel[] = []
    const allSockets = await socket.nsp.except(room).fetchSockets()
    const onlineIds = new Set<number>()
    if (channels != null) {
      invitations = channels.filter((channel) => channel.$extras.pivot_accepted == false)
    }

    for (const remoteSocket of allSockets) {
      onlineIds.add(remoteSocket.data.userId)
    }

    const onlineUsers = await User.findMany([...onlineIds])

    socket.emit('user:list', onlineUsers)
    socket.emit('user:invitations', invitations)

    logger.info('new websocket connection')
  }

  // see https://socket.io/get-started/private-messaging-part-2/#disconnection-handler
  public async onDisconnected({ socket, auth, logger }: WsContextContract, reason: string) {
    const room = this.getUserRoom(auth.user!)
    const userSockets = await socket.in(room).allSockets()

    // user is disconnected
    if (userSockets.size === 0) {
      // notify other users
      socket.broadcast.emit('user:offline', auth.user)
    }

    logger.info('websocket disconnected', reason)
  }

  // send an event to user to refresh his invitations
  public async onRefresh({ socket, logger }: WsContextContract, user: User): Promise<void> {
    let user_model = await User.find(user.id)
    if (user_model == null) {
      return
    }
    await user_model.load('channels')
    let channels = user_model.channels
    let invitations: Channel[] = []
    if (channels != null) {
      invitations = channels.filter((channel) => channel.$extras.pivot_accepted == false)
    }

    const room = this.getUserRoom(user)

    socket.join(room)
    socket.in(room).emit('user:invitations', invitations)
    logger.info(`user ${user.id} - invites refreshed`)
  }

  public async on_change_notifs({ socket }, user: User): Promise<void> {
    let tmp = await User.find(user.id)
    if (tmp) {
      tmp.notifications = user.notifications
      tmp.save()
    }
  }
}
