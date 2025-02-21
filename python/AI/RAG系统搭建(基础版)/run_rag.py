from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.huggingface import HuggingFaceLLM

# 初始化一个HuggingFaceEmbedding对象，用于将文本转换为向量表示
# 指定了一个预训练的sentence-transformer模型的路径
embed_model = HuggingFaceEmbedding(
    model_name=r"D:\jinux\models\Ceceliachenen\paraphrase-multilingual-MiniLM-L12-v2"
)

# 将创建的嵌入模型赋值给全局设置的embed_model属性，
# 这样在后续的索引构建过程中就会使用这个模型。
Settings.embed_model = embed_model

# 推理模型（生成模型）
llm = HuggingFaceLLM(
  # 给定的是本地模型的全路径
  model_name=r"D:\jinux\models\Qwen\Qwen2___5-0___5B-Instruct", # 这里是下载的模型名字
  tokenizer_name=r"D:\jinux\models\Qwen\Qwen2___5-0___5B-Instruct", # 模型名字
  model_kwargs={"trust_remote_code":True},
  tokenizer_kwargs={"trust_remote_code":True}
)

# 设置全局的llm属性，这样在索引查询时会使用这个模型
Settings.llm = llm

# RAG 系统构建过程
# 从指定目录读取所有文档，并加载数据到内存中，required_exts 只加载指定扩展名的文档
documents = SimpleDirectoryReader("./documents", required_exts=[".txt"]).load_data()

# 创建一个VectorStoreIndex，并使用之前加载的文档来构建索引
# 此索引将文档转换为向量，并存储这些向量以便于快速检索
# 默认是存储在内存中的
index = VectorStoreIndex.from_documents(documents)

# 创建一个查询引擎，这个引擎可以接收查询并返回相关文档的响应
query_engine = index.as_query_engine()
response = query_engine.query("请简单的介绍一下jinux")

print(response)