<script setup lang="ts">
import { formatTime, useNotes } from "../composables/useNotes";
import type { Note } from "../composables/useNotes";

const { trashNotes, restore, purge, emptyTrash } = useNotes();

function onRestore(n: Note): void {
  restore(n.id);
}

function onPurge(n: Note): void {
  const ok = window.confirm(`彻底删除「${n.title.trim() || "无标题"}」？此操作不可恢复。`);
  if (ok) purge(n.id);
}

function onEmpty(): void {
  const ok = window.confirm("确定清空回收站吗？此操作不可恢复。");
  if (ok) emptyTrash();
}
</script>

<template>
  <div class="trash-panel">
    <div class="trash-header">
      <h2>回收站</h2>
      <button class="btn btn-danger btn-sm" :disabled="trashNotes.length === 0" @click="onEmpty">清空回收站</button>
    </div>

    <div v-if="trashNotes.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
        </svg>
      </div>
      <h2>回收站是空的</h2>
      <p>删除的笔记会暂存在这里，可恢复或彻底清除</p>
    </div>

    <ul v-else class="trash-list">
      <li v-for="n in trashNotes" :key="n.id" class="trash-item">
        <div class="info">
          <div class="title">{{ n.title.trim() || "无标题" }}</div>
          <div class="time">删除于 {{ n.deletedAt ? formatTime(n.deletedAt) : "未知时间" }}</div>
        </div>
        <button class="btn btn-ghost btn-sm" @click="onRestore(n)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>恢复</span>
        </button>
        <button class="btn btn-danger btn-sm" @click="onPurge(n)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
          </svg>
          <span>彻底删除</span>
        </button>
      </li>
    </ul>
  </div>
</template>