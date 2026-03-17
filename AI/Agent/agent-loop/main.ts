import { TOOLKIT, type ToolName } from "./tools"

type Role = "system" | "user" | "assistant"

type ChatMessage = {
  role: Role
  content: string
}

type ParsedAssistant = {
  action?: { tool: string; input: string }
  final?: string
}

type QWenMessage = { content?: string }
type QWenChoice = { message?: QWenMessage }
type QWenResponse = { choices?: QWenChoice[] }

let API_KEY:string = ''
/**
 * 调用 QWen API 获取模型回复
 * @param messages 对话消息列表，包含 system、user 和 assistant 角色的消息
 * @returns 模型生成的回复文本
 * @throws 如果 API 请求失败或返回格式不正确，将抛出错误
 */
async function callLLMs(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "qwen3.5-plus",
      messages,
      temperature: 0.35,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`QWen API 错误: ${res.status} ${text}`)
  }

  const data = (await res.json()) as QWenResponse
  const content = data.choices?.[0]?.message?.content
  if (typeof content !== "string") {
    throw new Error("QWen 返回内容为空")
  }
  return content
}

/**
 * 解析 Assistant 回复，提取工具调用信息或最终回答
 * @param content Assistant 回复的文本内容，可能包含 <action> 或 <final> 标签 
 * @returns ParsedAssistant 对象，包含 action（工具调用信息）或 final（最终回答）字段
 */
function parseAssistant(content: string): ParsedAssistant {
  const actionMatch = content.match(
    /<action[^>]*tool="([^"]+)"[^>]*>([\s\S]*?)<\/action>/i,
  )
  const finalMatch = content.match(/<final>([\s\S]*?)<\/final>/i)

  const parsed: ParsedAssistant = {}
  if (actionMatch) {
    parsed.action = {
      tool: actionMatch[1] as ToolName,
      input: actionMatch[2]?.trim() ?? "",
    }
  }
  if (finalMatch) {
    parsed.final = finalMatch[1]?.trim()
  }

  return parsed
}

/**
 * Agent 主循环，负责与 LLM 交互、解析回复、调用工具并更新对话历史
 * @param question 
 * @returns 最终回答字符串，或错误提示
 */
async function AgentLoop(question: string) {
  API_KEY = await Bun.file("API_KEY.md").text()
  const systemPrompt = await Bun.file("prompt.md").text()

  const history: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: question },
  ]

  for (let step = 0; step < 10; step++) {
    const assistantText = await callLLMs(history)
    console.log(`\n[LLM 第 ${step + 1} 轮输出]\n${assistantText}\n`)
    history.push({ role: "assistant", content: assistantText })

    const parsed = parseAssistant(assistantText)
    if (parsed.final) {
      return parsed.final
    }

    if (parsed.action) {
      const toolFn = TOOLKIT[parsed.action.tool as ToolName]
      let observation: string

      if (toolFn) {
        observation = await toolFn(parsed.action.input)
      } else {
        observation = `未知工具: ${parsed.action.tool}`
      }

      console.log(`<observation>${observation}</observation>\n`)

      history.push({
        role: "user",
        content: `<observation>${observation}</observation>`,
      })
      continue
    }

    break // 未产生 action 或 final
  }

  return "未能生成最终回答，请重试或调整问题。"
}

/**
 * 程序入口，读取用户问题，调用 AgentLoop 获取回答并输出
 */
async function main() {
  const userQuestion = process.argv.slice(2).join(" ") || "沈阳现在天气如何？"
  console.log(`用户问题: ${userQuestion}`)

  try {
    const answer = await AgentLoop(userQuestion)
    console.log("\n=== 最终回答 ===")
    console.log(answer)
  } catch (err) {
    console.error(`运行失败: ${(err as Error).message}`)
  }
}

await main()
