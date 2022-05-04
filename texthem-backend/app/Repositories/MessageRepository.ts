import type {
  MessageRepositoryContract,
  SerializedMessage,
} from '@ioc:Repositories/MessageRepository'
import Channel from 'App/Models/Channel'
import Message from 'App/Models/Message'
import { DateTime } from 'luxon'

export default class MessageRepository implements MessageRepositoryContract {
  public async getAll(channelName: string): Promise<SerializedMessage[]> {
    const channel = await Channel.query()
      .where('name', channelName)
      .preload('messages', (messagesQuery) =>
        messagesQuery.preload('author').orderBy('created_at', 'desc').limit(10)
      )

      .firstOrFail()

    return channel.messages.map((message) => message.serialize() as SerializedMessage).reverse()
  }

  public async getNew(channelName: string, timestamp): Promise<SerializedMessage[]> {
    const channel = await Channel.query()
      .where('name', channelName)
      .preload('messages', (messagesQuery) =>
        messagesQuery
          .where('created_at', '<', timestamp)
          .orderBy('created_at', 'desc')
          .limit(10)
          .preload('author')
      )
      .firstOrFail()

    return channel.messages.map((message) => message.serialize() as SerializedMessage).reverse()
  }

  public async create(
    channelName: string,
    userId: number,
    content: string
  ): Promise<SerializedMessage> {
    const channel = await Channel.findByOrFail('name', channelName)
    const message = await channel.related('messages').create({ createdBy: userId, content })
    await message.load('author')

    return message.serialize() as SerializedMessage
  }
}
