import { HttpClient } from './http_base'

const chatpgtClient = HttpClient(process.env.CHATGPT_API_URL)

export class ChatGPT {
    constructor() {
    }

    async askAi(body) {
        const res = await chatpgtClient.post('/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            ...body,
        }, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, connection: "" },
        })

        
        return res?.choices[0]?.message?.content.trim() || ''
    }
}