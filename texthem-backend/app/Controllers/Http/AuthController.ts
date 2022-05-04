import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'
import Channel from 'App/Models/Channel'

export default class AuthController {
  async register({ request }: HttpContextContract) {
    // if invalid, exception

    const data = await request.validate(RegisterUserValidator)

    const user = await User.create(data)
    user.notifications = false
    user.save()
    
    // join user to general channel
    // const general = await Channel.findByOrFail('name', 'general')
    // await user.related('channels').attach([general.id])

    return user
  }

  async login({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    return auth.use('api').attempt(email, password)
  }

  async logout({ auth }: HttpContextContract) {
    return auth.use('api').logout()
  }

  async me({ auth }: HttpContextContract) {
    await auth.user!.load('channels')
    let channels = auth.user?.channels

    let channels_real: Channel[] = []

    // let invites = channels.filter((channel) => channel.$extras.pivot_accepted)
    if (channels != null) {
      for (let i = 0; i < channels.length; i++) {
        if (channels[i].$extras.pivot_accepted) {
          channels_real.push(channels[i])
        }
      }
    }

    return {
      user: auth.user,
      real_channels: channels_real,
    }
  }
}
