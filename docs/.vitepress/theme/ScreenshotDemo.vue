<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'https://shotsnap.vercel.app/api/screenshot'
const LOG_KEY = 'shotsnap-demo-requests'
const WINDOW_MS = 10 * 60 * 1000

const page = ref('https://example.com')
const width = ref(1280)
const height = ref(720)
const src = ref('')
const state = ref<'idle' | 'loading' | 'done' | 'error'>('idle')
const size = ref('')
const recent = ref(0)
const copied = ref(false)

/** The endpoint's limit is per IP, so this count only covers clicks on this page in this browser. */
function readLog(): number[] {
  try {
    const now = Date.now()
    return (JSON.parse(localStorage.getItem(LOG_KEY) ?? '[]') as number[]).filter((t) => now - t < WINDOW_MS)
  } catch {
    return []
  }
}

function writeLog(log: number[]) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log))
  } catch {}
}

onMounted(() => (recent.value = readLog().length))

const clamp = (n: number) => Math.min(1920, Math.max(320, Math.round(Number(n) || 0)))

const target = computed(() => {
  const t = page.value.trim()
  return /^https?:\/\//i.test(t) ? t : t ? `https://${t}` : ''
})

const requestUrl = computed(() => {
  if (!target.value) return ''
  const q = new URLSearchParams({ page: target.value, width: String(clamp(width.value)), height: String(clamp(height.value)) })
  return `${ENDPOINT}?${q}`
})

function take() {
  if (!requestUrl.value || state.value === 'loading') return
  const log = [...readLog(), Date.now()]
  writeLog(log)
  recent.value = log.length
  size.value = ''
  state.value = 'loading'
  src.value = requestUrl.value
}

function onLoad(e: Event) {
  const img = e.target as HTMLImageElement
  size.value = `${img.naturalWidth}x${img.naturalHeight}`
  state.value = 'done'
}

function onError() {
  state.value = 'error'
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(requestUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}
</script>

<template>
  <div class="sd">
    <div class="sd-grid">
      <label class="sd-field sd-wide">
        <span>Page URL</span>
        <input v-model="page" type="text" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://example.com" />
      </label>
      <label class="sd-field">
        <span>Width</span>
        <input v-model.number="width" type="number" min="320" max="1920" step="10" />
      </label>
      <label class="sd-field">
        <span>Height</span>
        <input v-model.number="height" type="number" min="320" max="1920" step="10" />
      </label>
    </div>

    <p class="sd-label">Request URL</p>
    <div class="sd-row">
      <code class="sd-code">{{ requestUrl || 'Enter a page URL' }}</code>
      <button type="button" class="sd-btn sd-btn-line" :disabled="!requestUrl" @click="copyUrl">{{ copied ? 'Copied' : 'Copy' }}</button>
    </div>

    <div class="sd-actions">
      <button type="button" class="sd-btn" :disabled="!requestUrl || state === 'loading'" @click="take">
        {{ state === 'loading' ? 'Capturing…' : 'Take screenshot' }}
      </button>
      <span class="sd-count">One request per click. This page has sent {{ recent }} of 7 in the last 10 minutes.</span>
    </div>

    <div class="sd-out" aria-live="polite">
      <p v-if="state === 'error'" class="sd-error" role="alert">
        No image came back. The most likely reason is the rate limit: the free endpoint allows 7 requests per 10 minutes per IP address
        and answers HTTP 429 after that. Other tools on your network count against the same address. Wait until the 10-minute window
        resets and try again. The capture also fails when the page cannot be loaded from the service.
      </p>
      <p v-if="state === 'done'" class="sd-note">PNG, {{ size }} pixels: twice the {{ clamp(width) }}x{{ clamp(height) }} viewport you asked for.</p>
      <img
        v-if="src"
        v-show="state === 'done'"
        :src="src"
        class="sd-img"
        :alt="`Screenshot of ${target}`"
        @load="onLoad"
        @error="onError"
      />
    </div>
  </div>
</template>

<style scoped>
.sd {
  margin: 24px 0 8px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.sd-grid {
  display: grid;
  grid-template-columns: 1fr 110px 110px;
  gap: 12px;
}
.sd-field span,
.sd-label {
  display: block;
  margin: 0 0 6px !important;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.sd-field input {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 15px;
}
.sd-field input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.sd-label {
  margin-top: 16px !important;
}
.sd-row {
  display: flex;
  gap: 8px;
}
.sd-code {
  flex: 1;
  min-width: 0;
  padding: 10px 12px !important;
  border-radius: 8px !important;
  word-break: break-all;
  font-size: 13px !important;
  line-height: 1.5;
}
.sd-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  margin-top: 16px;
}
.sd-btn {
  height: 42px;
  padding: 0 18px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  font-weight: 600;
}
.sd-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}
.sd-btn:disabled {
  opacity: 0.6;
  cursor: default;
}
.sd-btn-line {
  background: transparent;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  height: auto;
}
.sd-btn-line:hover:not(:disabled) {
  background: var(--vp-c-brand-soft);
}
.sd-count {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.sd-error {
  margin: 16px 0 0 !important;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-warning-2);
  border-radius: 8px;
  background: var(--vp-c-warning-soft);
}
.sd-note {
  margin: 16px 0 8px !important;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.sd-img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
@media (max-width: 560px) {
  .sd {
    padding: 14px;
  }
  .sd-grid {
    grid-template-columns: 1fr 1fr;
  }
  .sd-wide {
    grid-column: 1 / -1;
  }
  .sd-row {
    flex-direction: column;
  }
  .sd-btn-line {
    height: 38px;
  }
}
</style>
