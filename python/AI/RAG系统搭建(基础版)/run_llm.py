from llama_index.llms.huggingface import HuggingFaceLLM
from llama_index.core.llms import ChatMessage

# 使用HuggingFace 加载本地大模型
llm = HuggingFaceLLM(
  # 给定的是本地模型的全路径
  model_name=r"D:\jinux\models\Qwen\Qwen2___5-0___5B-Instruct", # 这里是下载的模型名字
  tokenizer_name=r"D:\jinux\models\Qwen\Qwen2___5-0___5B-Instruct", # 模型名字
  model_kwargs={"trust_remote_code":True},
  tokenizer_kwargs={"trust_remote_code":True}
)
rsp = llm.chat(messages=[ChatMessage(content="请简单的介绍一下jinux")])
print(rsp)