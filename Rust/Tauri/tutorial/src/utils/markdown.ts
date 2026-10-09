import MarkdownIt from "markdown-it";

// html: false 会把原始 HTML 转义，避免渲染时注入脚本
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

export function renderMarkdown(src: string): string {
  return md.render(src ?? "");
}