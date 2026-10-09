<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { formatTime, useNotes } from "../composables/useNotes";
import type { Note } from "../composables/useNotes";
import { useTheme } from "../composables/useTheme";
import NoteEditor from "./NoteEditor.vue";
import TrashPanel from "./TrashPanel.vue";

const emit = defineEmits<{ logout: [] }>();

const { currentId, searchQuery, current, activeNotes, trashNotes, selectNote, newNote, flush } = useNotes();
const { theme, toggleTheme } = useTheme();

const filter = ref<"all" | "favorite" | "trash">("all");
const editorRef = ref<InstanceType<typeof NoteEditor> | null>(null);

function matches(n: Note): boolean {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return true;
  return `${n.title} ${n.content}`.toLowerCase().includes(q);
}

const shownActive = computed(() => activeNotes.value.filter(matches));
const shownFavorite = computed(() => shownActive.value.filter((n) => n.favorite));
const shownTrash = computed(() => trashNotes.value.filter(matches));

const displayed = computed(() => (filter.value === "favorite" ? shownFavorite.value : shownActive.value));

function snippet(n: Note): string {
  return n.content.replace(/\s+/g, " ").trim() || "空白笔记";
}

function onNewNote(): void {
  newNote();
  filter.value = "all";
  nextTick(() => editorRef.value?.focusTitle());
}

function onLogout(): void {
  flush();
  emit("logout");
}

function onBeforeUnload(): void {
  flush();
}

onMounted(() => window.addEventListener("beforeunload", onBeforeUnload));
onBeforeUnmount(() => window.removeEventListener("beforeunload", onBeforeUnload));
</script>

<template>
  <div id="app-view" class="view">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <span class="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
              <path d="M8 2v20" />
              <path d="M12 8h5M12 12h5M12 16h5" />
            </svg>
          </span>
          <span class="brand-name">云笔记</span>
        </div>
        <button class="btn btn-primary btn-block" @click="onNewNote">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>新建笔记</span>
        </button>
      </div>

      <div class="filters">
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
        <button :class="{ active: filter === 'favorite' }" @click="filter = 'favorite'">收藏</button>
        <button :class="{ active: filter === 'trash' }" @click="filter = 'trash'">回收站</button>
      </div>

      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input v-model="searchQuery" type="text" :placeholder="filter === 'trash' ? '搜索回收站...' : '搜索笔记...'" />
      </div>

      <ul class="note-list">
        <li v-if="filter === 'trash'" class="note-empty">
          {{ trashNotes.length ? `回收站中有 ${trashNotes.length} 篇笔记` : "回收站是空的" }}
        </li>
        <template v-else>
          <li v-if="displayed.length === 0" class="note-empty">
            {{ searchQuery.trim() ? "没有匹配的笔记" : filter === 'favorite' ? "还没有收藏的笔记" : "还没有笔记" }}
          </li>
          <li
            v-for="n in displayed"
            :key="n.id"
            class="note-item"
            :class="{ active: n.id === currentId }"
            @click="selectNote(n.id)"
          >
            <div class="note-item-title">
              <span v-if="n.pinned" class="badge pin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 17v5" />
                  <path d="M9 4h6l1 7 2 2H6l2-2 1-7z" />
                </svg>
              </span>
              <span v-if="n.favorite" class="badge star">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <span class="title-text">{{ n.title.trim() || "无标题" }}</span>
            </div>
            <div class="note-item-snippet">{{ snippet(n) }}</div>
            <div class="note-item-time">{{ formatTime(n.updatedAt) }}</div>
          </li>
        </template>
      </ul>

      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="avatar">A</div>
          <div class="user-meta">
            <span class="user-name">admin</span>
            <span class="user-role">管理员</span>
          </div>
        </div>
        <div class="footer-actions">
          <button class="btn btn-ghost" :title="theme === 'dark' ? '切换到浅色' : '切换到深色'" @click="toggleTheme">
            <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <button class="btn btn-ghost" title="退出登录" @click="onLogout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <main class="editor">
      <TrashPanel v-if="filter === 'trash'" />
      <div v-else-if="!current" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
            <path d="M8 2v20" />
            <path d="M12 8h5M12 12h5M12 16h5" />
          </svg>
        </div>
        <h2>{{ filter === 'favorite' ? '选择一篇收藏的笔记' : '选择或创建一篇笔记' }}</h2>
        <p>点击左上角「新建笔记」开始记录</p>
      </div>
      <NoteEditor v-else ref="editorRef" />
    </main>
  </div>
</template>