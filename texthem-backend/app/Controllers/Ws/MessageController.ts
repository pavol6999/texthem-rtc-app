import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository'
import { inject } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import Channel from 'App/Models/Channel'

// inject repository from container to controller constructor
// we do so because we can extract database specific storage to another class
// and also to prevent big controller methods doing everything
// controler method just gets data (validates it) and calls repository
// also we can then test standalone repository without controller
// implementation is bind into container inside providers/AppProvider.ts
@inject(['Repositories/MessageRepository'])
export default class MessageController {
  constructor(private messageRepository: MessageRepositoryContract) {}

  public async loadMessages({ socket, params }: WsContextContract) {
    const MAX_AGE = 30
    let is_old = false

    let rn = DateTime.now()
    let messages = (await this.messageRepository.getAll(params.name)).sort((a, b) => {
      let da = (a as any).created_at
      let db = (b as any).created_at
      return Date.parse(db) - Date.parse(da)
    })

    let channel = await Channel.query().where('name', params.name).first()
    if (channel) {
      if (messages.length > 0) {
        let e = messages[0] as any
        let raw_date = e.created_at.split('.')[0]
        let date = raw_date.split('T')[0].split('-')
        let time = raw_date.split('T')[1].split(':')

        let tmp = {
          year: date[0],
          month: date[1],
          day: date[2],
          hour: time[0],
          minute: time[1],
          second: time[2],
          millisecond: 0,
        }
        let dt = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2])
        let now = new Date()
        let dayDiff = Math.floor((now.getTime() - dt.getTime()) / (1000 * 60 * 60 * 24))

        if (dayDiff > MAX_AGE) is_old = true
      } else {
        let diff = rn.diff(channel?.createdAt, 'days').days

        if (diff > MAX_AGE) {
          is_old = true
          socket.broadcast.emit('channelDeleted', params.name)
        }
      }
    }

    if (is_old) {
      channel?.delete()

      return null
    }
    return (await this.messageRepository.getAll(params.name)).slice(0, 20)
  }

  public async loadNewMessages({ params }: WsContextContract, timestamp: string) {
    return await this.messageRepository.getNew(params.name, timestamp)
  }

  public async notify({ socket, params }: WsContextContract, user: User) {
    socket.broadcast.emit('user:new', { channel: params.name, user: user })
  }
  public async notifyLeave({ socket, params }: WsContextContract, user: User) {
    socket.broadcast.emit('user:leave', { channel: params.name, user: user })
  }

  public async addMessage({ params, socket, auth }: WsContextContract, content: string) {
    const message = await this.messageRepository.create(params.name, auth.user!.id, content)
    // broadcast message to other users in channel
    socket.broadcast.emit('message', message)
    // return message to sender
    return message
  }

  public async deleteChannel({ socket }: WsContextContract, channel_name: string) {
    socket.broadcast.emit('channelDeleted', channel_name)
  }

  public async someoneTyping(
    { socket }: WsContextContract,
    channel: string,
    user: string,
    message: string
  ) {
    socket.broadcast.emit('someoneTyping', { channel, user, message })
  }

  public async userKicked({ socket }: WsContextContract, username: string) {
    socket.broadcast.emit('userWasKicked', { username: username })
  }
}
