import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import { ChannelType } from 'App/Models/Channel'

export default class ChannelController {
    async join({ request, auth, response} : HttpContextContract) {
        let channel_name = request.body().name
        let is_private = request.body().private 

        let nt = ChannelType.PUBLIC
        if (is_private) {
            nt = ChannelType.PRIVATE;
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
                    owner_id: req_user_id as number
                },
            ])
            user?.related('channels').attach([new_ch[0].id]) 
            response.status(200)
            response.send({ new_channel: new_ch[0] })
        } else {
            if (channel.type === "public") {
                let q = await user?.related('channels').query().where("name", channel_name).first()
                if (q?.name == undefined) {
                    user?.related('channels').attach([channel.id]);
                    response.status(200)
                    response.send( { new_channel: channel })
                } else {
                    response.status(403)
                    response.send("already a member of that channel")
                }
            } else {
                response.status(403)
                response.send('that channel exists and is private')
            }
        } 
    }

    async cancel( {request, auth, response }: HttpContextContract) {
        let channel_name = request.body().name
        let req_user_id = auth.user?.id || undefined

        let channel = await Channel.findBy('name', channel_name)
        let user = await User.findBy('id', req_user_id)

        if (channel != null) {    
            user?.related('channels').detach([channel.id])
            let removing = false
            if (channel.owner_id === req_user_id) {
                let res = await Channel.findBy('owner_id', req_user_id)
                res?.delete()
                removing = true
            }

            response.status(200)
            response.send( { left_channel: channel, was_removed: removing })
        } else {
            response.status(403)
            response.send('nonexistent channel lol')
        }
    }

    async quit( {request, auth, response }: HttpContextContract) {
        let channel_name = request.body().name
        let req_user_id = auth.user?.id || undefined

        let channel = await Channel.findBy('name', channel_name)

        if (channel != null && channel.owner_id === req_user_id) {    
            let res = await Channel.findBy('owner_id', req_user_id)
            res?.delete()

            response.status(200)
            response.send( { left_channel: channel, was_removed: true })
        } else {
            response.status(403)
            response.send('nonexistent channel or not an owner')
        }
    }
}
