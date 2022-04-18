import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Message from 'App/Models/Message'
import User from 'App/Models/User'

export enum ChannelType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: ChannelType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message, {
    foreignKey: 'channelId',
  })
  public messages: HasMany<typeof Message>

  @column()
  public owner_id: number

  @belongsTo(() => User, {
    foreignKey: 'owner_id',
  })
  public owner: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
    pivotColumns: ['inviter_id', 'accepted', 'message_read_at']
  })
  public users: ManyToMany<typeof User>
}
