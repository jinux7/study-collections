import { computed, ref } from "vue";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  favorite: boolean;
  deleted: boolean;
  deletedAt?: number;
}

const STORAGE_KEY = "yunnote.notes.v1";

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// 兼容旧数据：为缺失字段补上默认值
function normalize(n: Partial<Note>): Note {
  const now = Date.now();
  return {
    id: n.id ?? uid(),
    title: n.title ?? "",
    content: n.content ?? "",
    createdAt: n.createdAt ?? now,
    updatedAt: n.updatedAt ?? now,
    pinned: n.pinned ?? false,
    favorite: n.favorite ?? false,
    deleted: n.deleted ?? false,
    deletedAt: n.deletedAt,
  };
}

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<Note>[];
    return Array.isArray(parsed) ? parsed.map(normalize) : [];
  } catch {
    return [];
  }
}

export function formatTime(ts: number): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ts);
}

// —— 以下是模块级共享状态（单例），多个组件调用 useNotes() 拿到的都是同一份数据 ——
const notes = ref<Note[]>(loadNotes());
const currentId = ref<string | null>(null);
const searchQuery = ref("");
const saveStatus = ref("已保存");
let saveTimer: number | undefined;

const current = computed<Note | null>(() => {
  const n = currentId.value ? notes.value.find((x) => x.id === currentId.value) : undefined;
  // 已删除的笔记不能作为正在编辑的当前笔记
  return n && !n.deleted ? n : null;
});

// 未删除的笔记：置顶优先，其余按更新时间倒序
const activeNotes = computed<Note[]>(() =>
  notes.value
    .filter((n) => !n.deleted)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt)
);

// 回收站中的笔记：按删除时间倒序
const trashNotes = computed<Note[]>(() =>
  notes.value
    .filter((n) => n.deleted)
    .sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0))
);

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value));
}

function markDirty(): void {
  saveStatus.value = "保存中…";
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    persist();
    saveStatus.value = "已保存";
  }, 400);
}

function selectNote(id: string): void {
  const n = notes.value.find((x) => x.id === id);
  if (!n || n.deleted) return;
  currentId.value = id;
  saveStatus.value = "已保存";
}

function newNote(): void {
  const now = Date.now();
  const note: Note = {
    id: uid(),
    title: "",
    content: "",
    createdAt: now,
    updatedAt: now,
    pinned: false,
    favorite: false,
    deleted: false,
  };
  notes.value.unshift(note);
  currentId.value = note.id;
  saveStatus.value = "已保存";
  persist();
}

function updateCurrent(patch: { title?: string; content?: string }): void {
  if (!currentId.value) return;
  const n = notes.value.find((x) => x.id === currentId.value);
  if (!n) return;
  if (patch.title !== undefined) n.title = patch.title;
  if (patch.content !== undefined) n.content = patch.content;
  n.updatedAt = Date.now();
  markDirty();
}

function togglePinned(): void {
  if (!current.value) return;
  current.value.pinned = !current.value.pinned;
  persist();
}

function toggleFavorite(): void {
  if (!current.value) return;
  current.value.favorite = !current.value.favorite;
  persist();
}

// 软删除：移入回收站
function softDelete(): void {
  if (!current.value) return;
  current.value.deleted = true;
  current.value.deletedAt = Date.now();
  currentId.value = null;
  saveStatus.value = "已保存";
  window.clearTimeout(saveTimer);
  persist();
}

function restore(id: string): void {
  const n = notes.value.find((x) => x.id === id);
  if (!n) return;
  n.deleted = false;
  n.deletedAt = undefined;
  persist();
}

// 彻底删除单篇
function purge(id: string): void {
  notes.value = notes.value.filter((x) => x.id !== id);
  persist();
}

// 清空回收站
function emptyTrash(): void {
  notes.value = notes.value.filter((x) => !x.deleted);
  persist();
}

function flush(): void {
  window.clearTimeout(saveTimer);
  persist();
}

export function useNotes() {
  return {
    notes,
    currentId,
    searchQuery,
    saveStatus,
    current,
    activeNotes,
    trashNotes,
    selectNote,
    newNote,
    updateCurrent,
    togglePinned,
    toggleFavorite,
    softDelete,
    restore,
    purge,
    emptyTrash,
    flush,
  };
}