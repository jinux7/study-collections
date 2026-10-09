<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { formatTime, useNotes } from "../composables/useNotes";
import { renderMarkdown } from "../utils/markdown";

const { current, saveStatus, updateCurrent, togglePinned, toggleFavorite, softDelete } = useNotes();

const mode = ref<"edit" | "preview" | "split">("edit");
const titleInput = ref<HTMLInputElement | null>(null);

const rendered = computed(() => (current.value ? renderMarkdown(current.value.content) : ""));
const wordCount = computed(() => (current.value ? current.value.content.length : 0));
const dateText = computed(() =>
  current.value
    ? `创建于 ${formatTime(current.value.createdAt)} · 更新于 ${formatTime(current.value.updatedAt)}`
    : ""
);

function onTitleInput(e: Event): void {
  updateCurrent({ title: (e.target as HTMLInputElement).value });
}

function onContentInput(e: Event): void {
  updateCurrent({ content: (e.target as HTMLTextAreaElement).value });
}

function onDelete(): void {
  if (!current.value) return;
  const ok = window.confirm(`将「${current.value.title.trim() || "无标题"}」移入回收站？`);
  if (ok) softDelete();
}

// 预览区里的链接点击时不跳转，避免离开应用
function onPreviewClick(e: MouseEvent): void {
  const a = (e.target as HTMLElement).closest("a");
  if (a) e.preventDefault();
}

function focusTitle(): void {
  nextTick(() => titleInput.value?.focus());
}

defineExpose({ focusTitle });
</script>

<template>
  <div class="editor-pane">
    <div class="editor-toolbar">
      <input
        ref="titleInput"
        class="note-title"
        type="text"
        placeholder="无标题"
        :value="current?.title"
        @input="onTitleInput"
      />
      <div class="toolbar-actions">
        <button
          class="btn btn-icon"
          :class="{ active: current?.pinned }"
          :title="current?.pinned ? '取消置顶' : '置顶'"
          @click="togglePinned"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 17v5" />
            <path d="M9 4h6l1 7 2 2H6l2-2 1-7z" />
          </svg>
        </button>
        <button
          class="btn btn-icon"
          :class="{ active: current?.favorite }"
          :title="current?.favorite ? '取消收藏' : '收藏'"
          @click="toggleFavorite"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <span class="save-status">{{ saveStatus }}</span>
        <button class="btn btn-danger" @click="onDelete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
          </svg>
          <span>删除</span>
        </button>
      </div>
    </div>

    <div class="editor-meta">
      <span>{{ dateText }}</span>
      <span class="word-count">{{ wordCount }} 字</span>
    </div>

    <div class="mode-switch">
      <button :class="{ active: mode === 'edit' }" @click="mode = 'edit'">编辑</button>
      <button :class="{ active: mode === 'preview' }" @click="mode = 'preview'">预览</button>
      <button :class="{ active: mode === 'split' }" @click="mode = 'split'">分屏</button>
    </div>

    <div class="editor-body" :class="mode">
      <textarea
        v-show="mode !== 'preview'"
        class="note-content"
        placeholder="支持 Markdown：标题、列表、代码块、链接等"
        spellcheck="false"
        :value="current?.content"
        @input="onContentInput"
      ></textarea>
      <div v-show="mode !== 'edit'" class="markdown-body" v-html="rendered" @click="onPreviewClick"></div>
    </div>
  </div>
</template>