# 如何制作html的电子书

今天在看一个nodejs的教程的时候，里边一个例子就是制作一个命令行的工具包，这个工具包的写法我没有深入的研究，不过用法倒是很简单，感觉不错，就是制作一本html格式
的电子书。其实就是把.md markdown格式的文本转为html，这个工具包还有其它功能，下面贴出链接，以供参考。
https://github.com/imfly/gitbook-summary

### 使用方法
首先，安装2个工具
```text
npm install -g gitbook-summary
```
```text
npm install  -g  gitbook-cli
```
安装好了之后，直接在根目录下写关于电子书的文件夹，可以参考此项目《天龙八部》这本书的文件结构，
首先使用下面的命令生成一个SUMMARY.md的文件
```text
book sm
```
接着 gitbook build
```text
gitbook build
```
在目录下生成一个_book文件夹，里边已经是转换好了的html电子书，想用浏览器访问的话还得使用
```text
gitbook serve
```
默认port 4000，直接访问即可浏览电纸书内容，一个简单的制作电子书就完成了。

## 补充一下，其实_book已经是一个完成了的电子书，直接放在服务器环境下访问即可。


