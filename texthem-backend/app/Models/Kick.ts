import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Channel from './Channel'

export default class Kick extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  
  @column()
  public kicker_id: number

  @column()
  public kicked_id: number

  @column()
  public channel_id: number


  @belongsTo(() => User, {
    foreignKey: 'kicker_id',
  })
  public kicker: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'kicked_id',
  })
  public kicked: BelongsTo<typeof User>

  @belongsTo(() => Channel, {
    foreignKey: 'channel_id',
  })
  public channel: BelongsTo<typeof Channel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
