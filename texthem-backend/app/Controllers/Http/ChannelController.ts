import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import { ChannelType } from 'App/Models/Channel'
import Kick from 'App/Models/Kick'

export default class ChannelController {
  async join({ request, auth, response }: HttpContextContract) {
    let channel_name = request.body().name
    let is_private = request.body().private

    let nt = ChannelType.PUBLIC
    if (is_private) {
      nt = ChannelType.PRIVATE
    }

    let req_user_id = auth.user?.id || undefined

    let channel = await Channel.findBy('name', channel_name)
    let user = await User.findBy('id', req_user_id)

    if (channel == null) {
      // channel with that name does not exist yet
      const uniqueKey = 'name'
      let new_ch = await Channel.updateOrCreateMany(uniqueKey, [
        {
          name: channel_name,
          type: nt,
          owner_id: req_user_id as number,
        },
      ])
      await user?.related('channels').attach([new_ch[0].id])
      await user
        ?.related('channels')
        .pivotQuery()
        .where('channel_id', new_ch[0].id)
        .where('user_id', user.id)
        .update({
          accepted: true,
          inviter_id: user.id,
        })

      response.status(200)
      response.send({ new_channel: new_ch[0] })
    } else {
      if (channel.type === 'public' && user != null) {
        let q = await user?.related('channels').query().where('name', channel_name).first()
        if (q?.name == undefined) {
          // ban check
          let can_join = false
          let res = await Kick.query().where('kicked_id', user.id).where('channel_id', channel.id)
          let kicked_by_owner = false
          if (res.length < 3) {
            for (let i = 0; i < res.length; i++) {
              if (res[i].kicker_id === channel.owner_id) {
                kicked_by_owner = true
              }
            }

            if (!kicked_by_owner) {
              can_join = true
            }
          }

          // isnt banned
          if (can_join) {
            await user?.related('channels').attach([channel.id])
            await user
              ?.related('channels')
              .pivotQuery()
              .where('channel_id', channel.id)
              .where('user_id', user.id)
              .update({
                accepted: true,
                inviter_id: user.id,
              })

            response.status(200)
            response.send({ new_channel: channel })
          } else {
            response.status(403)
            response.send('user is banned, cannot join')
          }
        } else {
          response.status(403)
          response.send('already a member of that channel')
        }
      } else {
        response.status(403)
        response.send('that channel exists and is private')
      }
    }
  }

  async cancel({ request, auth, response }: HttpContextContract) {
    let channel_name = request.body().name
    let req_user_id = auth.user?.id || undefined

    let channel = await Channel.findBy('name', channel_name)
    let user = await User.findBy('id', req_user_id)

    if (channel != null) {
      user?.related('channels').detach([channel.id])
      let removing = false
      if (channel.owner_id === req_user_id) {
        channel.delete()
        removing = true
      }

      response.status(200)
      response.send({ left_channel: channel, was_removed: removing })
    } else {
      response.status(403)
      response.send('nonexistent channel lol')
    }
  }

  async quit({ request, auth, response }: HttpContextContract) {
    let channel_name = request.body().name
    let req_user_id = auth.user?.id || undefined

    let channel = await Channel.findBy('name', channel_name)

    if (channel != null && channel.owner_id === req_user_id) {
      // let res = await Channel.findBy('owner_id', req_user_id)
      channel.delete()

      response.status(200)
      response.send({ left_channel: channel, was_removed: true })
    } else {
      response.status(403)
      response.send('nonexistent channel or not an owner')
    }
  }

  async listNicknames({ request, auth, response }: HttpContextContract) {
    let channel_name = request.param('name')
    let req_user_id = auth.user?.id || undefined

    let channel = await Channel.query().where('name', channel_name).first()

    if (channel != null && req_user_id) {
      let user = await User.query().where('id', req_user_id).preload('channels').first()
      let is_in_the_channel = false
      for (let i = 0; i < (user?.channels.length || 0); i++) {
        if (user?.channels[i].name === channel_name) {
          is_in_the_channel = true
        }
      }

      if (is_in_the_channel) {
        let channel_users: String[] = []
        let all_users = (await Channel.query().where('name', channel_name).preload('users').first())
          ?.users
        if (all_users != null) {
          for (let i = 0; i < all_users.length; i++) {
            let tmp = await all_users[i]
              .related('channels')
              .pivotQuery()
              .where('channel_id', channel.id)
              .where('user_id', all_users[i].id)
              .first()
            if (tmp.accepted) channel_users.push(all_users[i].nickname)
          }
        }

        response.status(200)
        response.send({ user_list: channel_users })
      } else {
        response.status(403)
        response.send('user not a member of that channel')
      }
    } else {
      response.status(403)
      response.send('nonexistent channel or no auth')
    }
  }
  async list({ request, auth, response }: HttpContextContract) {
    let channel_name = request.param('name')
    let req_user_id = auth.user?.id || undefined

    let channel = await Channel.query().where('name', channel_name).first()

    if (channel != null && req_user_id) {
      let user = await User.query().where('id', req_user_id).preload('channels').first()
      let is_in_the_channel = false
      for (let i = 0; i < (user?.channels.length || 0); i++) {
        if (user?.channels[i].name === channel_name) {
          is_in_the_channel = true
        }
      }

      if (is_in_the_channel) {
        let channel_users: User[] = []
        let all_users = (await Channel.query().where('name', channel_name).preload('users').first())
          ?.users
        if (all_users != null) {
          for (let i = 0; i < all_users.length; i++) {
            let tmp = await all_users[i]
              .related('channels')
              .pivotQuery()
              .where('channel_id', channel.id)
              .where('user_id', all_users[i].id)
              .first()
            if (tmp.accepted) channel_users.push(all_users[i])
          }
        }

        response.status(200)
        response.send({ items: all_users })
      } else {
        response.status(403)
        response.send('user not a member of that channel')
      }
    } else {
      response.status(403)
      response.send('nonexistent channel or no auth')
    }
  }

  async invite({ request, auth, response }: HttpContextContract) {
    let channel_name = request.body().name
    let username = request.body().username
    let already_there = false

    let channel = await Channel.query().where('name', channel_name).preload('users').first()
    let user = await User.query().where('nickname', username).preload('channels').first()

    let channel_users = channel?.users
    if (channel != null && user != null) {
      if (channel_users != null) {
        for (let i = 0; i < channel_users.length; i++)
          if (channel.users[i].nickname === username) already_there = true
      }

      if (already_there) {
        response.status(403)
        response.send('user already in the channel')
      } else {
        // ban check
        let can_be_invited = false

        if (channel.owner_id === auth.user?.id) {
          can_be_invited = true
          await Kick.query().where('kicked_id', user.id).where('channel_id', channel.id).delete()
        } else if (channel.type === ChannelType.PUBLIC) {
          let res = await Kick.query().where('kicked_id', user.id).where('channel_id', channel.id)
          let kicked_by_owner = false
          if (res.length < 3) {
            for (let i = 0; i < res.length; i++) {
              if (res[i].kicker_id === channel.owner_id) {
                kicked_by_owner = true
              }
            }

            if (!kicked_by_owner) {
              can_be_invited = true
            }
          }
        }

        // isnt banned
        if (can_be_invited) {
          await user?.related('channels').attach([channel.id])
          await user
            ?.related('channels')
            .pivotQuery()
            .where('channel_id', channel.id)
            .where('user_id', user.id)
            .update({
              accepted: false,
              inviter_id: auth.user?.id,
            })

          response.status(200)
          response.send('user invited')
        } else {
          response.status(403)
          response.send('user has been banned, cannot be invited')
        }
      }
    } else {
      response.status(403)
      response.send('something went wrong')
    }
  }

  async revoke({ request, auth, response }: HttpContextContract) {
    let channel_name = request.body().name
    let username = request.body().username
    let already_there = false

    let channel = await Channel.query().where('name', channel_name).preload('users').first()
    let user = await User.query().where('nickname', username).preload('channels').first()
    let channel_users = channel?.users
    if (channel != null && user != null) {
      if (channel_users != null) {
        for (let i = 0; i < channel_users.length; i++)
          if (channel.users[i].nickname === username) already_there = true
      }

      if (!already_there) {
        response.status(403)
        response.send('user isnt in the channel')
      } else {
        if (channel.type === ChannelType.PRIVATE && channel.owner_id == auth.user?.id) {
          await user?.related('channels').detach([channel.id])
          response.status(200)
          response.send('user revoked from private channel')
        } else {
          response.status(403)
          response.send('is a public channel or not an owner')
        }
      }
    } else {
      response.status(403)
      response.send('something went wrong')
    }
  }

  async kick({ request, auth, response }: HttpContextContract) {
    let channel_name = request.body().name
    let username = request.body().username
    let already_there = false

    let channel = await Channel.query().where('name', channel_name).preload('users').first()
    let user = await User.query().where('nickname', username).preload('channels').first()
    let channel_users = channel?.users
    if (channel != null && user != null && auth.user != null) {
      if (channel_users != null) {
        for (let i = 0; i < channel_users.length; i++)
          if (channel.users[i].nickname === username) already_there = true
      }

      if (!already_there) {
        response.status(403)
        response.send('user isnt in the channel')
      } else {
        if (
          channel.type === ChannelType.PUBLIC &&
          user.id != auth.user?.id &&
          user.id != channel.owner_id
        ) {
          await user?.related('channels').detach([channel.id])
          await Kick.updateOrCreate(
            {
              kicker_id: auth.user.id,
              kicked_id: user.id,
              channel_id: channel.id,
            },
            {
              kicker_id: auth.user.id,
              kicked_id: user.id,
              channel_id: channel.id,
            }
          )

          response.status(200)
          response.send('user kicked from public channel')
        } else {
          response.status(403)
          response.send('is a private channel, trying to kick yourself or owner')
        }
      }
    } else {
      response.status(403)
      response.send('something went wrong')
    }
  }

  async inviteAccept({ request, auth, response }: HttpContextContract) {
    let channel_name = request.body().name

    if (auth.user) {
      let user = await User.query().where('id', auth.user.id).first()
      let channel = await Channel.query().where('name', channel_name).first()
      if (channel && user) {
        await user
          ?.related('channels')
          .pivotQuery()
          .where('channel_id', channel.id)
          .where('user_id', user.id)
          .update({
            accepted: true,
          })

        response.status(200)
        response.send('invite accepted')
      } else {
        response.status(403)
        response.send('something went wrong')
      }
    } else {
      response.status(403)
      response.send('no auth')
    }
  }

  async inviteDecline({ request, auth, response }: HttpContextContract) {
    let channel_name = request.body().name

    if (auth.user) {
      let user = await User.query().where('id', auth.user.id).first()
      let channel = await Channel.query().where('name', channel_name).first()
      if (channel && user) {
        user.related('channels').detach([channel.id])
        response.status(200)
        response.send('invite declined')
      } else {
        response.status(403)
        response.send('something went wrong')
      }
    } else {
      response.status(403)
      response.send('no auth')
    }
  }
}
