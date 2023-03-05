import { WechatyBuilder } from 'wechaty'
import { getLogger } from 'src/utils'
import { scanHandle, loginHandle, messageHandle } from './wechaty_handle'
const logger = getLogger('wechaty')

export class WechatyClient {
    constructor() {
    }

    init() {
        const wechaty = WechatyBuilder.build()
        wechaty
            .on('scan', scanHandle)
            .on('login', loginHandle)
            .on('message', messageHandle)
            // .on('logout', logoutHandle)
            // .on('friendship', friendHandle)
            // .on('room-join', roomjoinHandle)
            // .on('room-topic', roomTopicHandle)
            // .on('room-leave', roomLeaveHandle)
            // .on('room-invite', roomInviteHandle)
        
        wechaty
            .start()
            .then(() => {
              logger.info('wechaty启动成功，准备扫码')
            })
            .catch(async function(e) {
              logger.error({ e }, 'wechaty启动失败')
              await wechaty.stop()
              process.exit(1)
            });
    }

    static create() {
        return new WechatyClient()
    }
}
