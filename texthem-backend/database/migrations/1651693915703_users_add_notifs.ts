import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersAddNotifs extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('notifications').defaultTo(false)
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('notifications')
    })  }
}
