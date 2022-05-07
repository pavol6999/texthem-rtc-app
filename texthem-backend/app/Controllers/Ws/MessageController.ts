import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import type { MessageRepositoryContract } from '@ioc:Repositories/MessageRepository'
import { inject } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'

// inject repository from container to controller constructor
// we do so because we can extract database specific storage to another class
// and also to prevent big controller methods doing everything
// controler method just gets data (validates it) and calls repository
// also we can then test standalone repository without controller
// implementation is bind into container inside providers/AppProvider.ts
@inject(['Repositories/MessageRepository'])
export default class MessageController {
  constructor(private messageRepository: MessageRepositoryContract) {}

  public async loadMessages({ params }: WsContextContract) {
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
}
