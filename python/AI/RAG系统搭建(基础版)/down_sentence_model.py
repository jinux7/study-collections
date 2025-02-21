# 模型下载
from modelscope import snapshot_download

# model_id 模型的id
# cache_dir 模型下载路径
model_dir = snapshot_download(model_id='Ceceliachenen/paraphrase-multilingual-MiniLM-L12-v2', cache_dir='D:/jinux/models')