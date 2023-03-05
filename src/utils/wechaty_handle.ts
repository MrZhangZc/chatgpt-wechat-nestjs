import * as qrterminal from 'qrcode-terminal'
import { getLogger } from 'src/utils'
import { ChatGPT } from './chatgpt'
const chatgptClient = new ChatGPT()

const logger = getLogger('wechaty')

const scanHandle = (qrcode) => {
    qrterminal.generate(qrcode, {small: true})
    const qrUrl = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
    logger.info({ qrUrl }, 'sanc qrimageurl')
}

const loginHandle = (user) => {
    logger.info({ user }, '登陆了')
}

async function replyRoomMessage(that,room, msg) {
    try{
        const contact = msg.talker();
        const contactName = contact.name()
        const roomName = await room.topic()
        if(process.env.GROUPS && !~process.env.GROUPS.indexOf(roomName)) return
        const type = msg.type();
        const mentionSelf = await msg.mentionSelf()
        // let contactAvatar = await contact.avatar();
        switch (type) {
          case that.Message.Type.Text:
            const content = msg.text();
            logger.info(`群名: ${roomName} 发消息人: ${contactName} 内容: ${content}`)
            if(mentionSelf){
                const answer = await chatgptClient.askAi({
                    messages: [
                        {"role": "user", "content": `${content}`},
                    ]
                })
                room.say(`@${contactName} ${answer}`)
            }
            break;
          case that.Message.Type.Emoticon:
              logger.info(`群名: ${roomName} 发消息人: ${contactName} 发了一个表情`)
            break;
          case that.Message.Type.Image:
            logger.info(`群名: ${roomName} 发消息人: ${contactName} 发了一张图片`)
            break;
          case that.Message.Type.Url:
            logger.info(`群名: ${roomName} 发消息人: ${contactName} 发了一个链接`)
            break;
          case that.Message.Type.Video:
            logger.info(`群名: ${roomName} 发消息人: ${contactName} 发了一个视频`)
            break;
          case that.Message.Type.Audio:
            logger.info(`群名: ${roomName} 发消息人: ${contactName} 发了一个语音`)
            break;
          default:
            break;
        }
    } catch (error) {
        logger.error('监听消息错误',error)
    }
}

async function replyFriendMessage(that, msg) {
    try {
        const type = msg.type();
        const contact = msg.talker();
        const contactName = contact.name()
        const isOfficial = contact.type() === that.Contact.Type.Official
        switch (type) {
        case that.Message.Type.Text:
            const content = msg.text();
            if(!isOfficial){
                logger.info(`发消息人${contactName}:${content}`)
                if(content.trim()){
                    const answer = await chatgptClient.askAi({
                        messages: [
                            {"role": "user", "content": `${content}`},
                        ]
                    })
                    contact.say(answer)
                }
            }else{
                logger.info('公众号消息')
            }
            break;
        case that.Message.Type.Emoticon:
            logger.info(`发消息人${contactName}:发了一个表情`)
            break;
        case that.Message.Type.Image:
            logger.info(`发消息人${contactName}:发了一张图片`)
            break;
        case that.Message.Type.Url:
            logger.info(`发消息人${contactName}:发了一个链接`)
            break;
        case that.Message.Type.Video:
            logger.info(`发消息人${contactName}:发了一个视频`)
            break;
        case that.Message.Type.Audio:
            logger.info(`发消息人${contactName}:发了一个视频`)
            break;
        default:
            break;
        }
    } catch (error) {
        logger.error('监听消息错误',error)
    }
}




function messageHandle (msg) {
    const room = msg.room(); 
    const msgSelf = msg.self(); 
    if(msgSelf) return

    if(!room && process.env.REPLY_FRIEND === 'true') {
        replyFriendMessage(this, msg)
    }

    if (room && process.env.REPLY_GROUP === 'true') {
        replyRoomMessage(this, room, msg)
    }
}

export {
    scanHandle,
    loginHandle,
    messageHandle
}