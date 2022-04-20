import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Kicks extends BaseSchema {
  protected tableName = 'kicks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
      .integer('kicker_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

      table
      .integer('kicked_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}


