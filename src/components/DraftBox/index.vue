<script setup>
import { watch, ref, computed, reactive, onMounted } from 'vue';
import { StorageUtil } from '@/utils/localstorage'

const styleStoreUtil = new StorageUtil('DRAFT_STYLE', { x: 0, y: 0, visible: true })
const props = defineProps({
  modelValue: {
    type: Boolean
  }
})
const emits = defineEmits(['update:modelValue'])
const state = reactive({
  translateX: 0,
  translateY: 0
})

const draftBox = ref('draftBox')
const listenerDraft = () => {
  let _downed = false
  let startX, startY, moveX, moveY, diffX, diffY = 0;
  const onMouseDown = (e) => {
    _downed = true
    startX = e.clientX - state.translateX
    startY = e.clientY - state.translateY
  }
  const onMouseMove = (e) => {
    if (!_downed) return
    moveX = e.clientX
    moveY = e.clientY
    diffX = moveX - startX
    diffY = moveY - startY
    state.translateX = diffX
    state.translateY = diffY
  }
  const onMouseUp = (e) => {
    _downed = false
    styleStoreUtil.setValue({
      x: diffX,
      y: diffY,
      visible: true
    })
  }
  draftBox.value.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  draftBox.value.addEventListener('mouseup', onMouseUp)
  return {
    remove: () => {
      draftBox.value.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      draftBox.value.removeEventListener('mouseup', onMouseUp)
    }
  }
}
const visible = ref(props.modelValue)

watch(() => props.modelValue, (value) => {
  visible.value = value
})
watch(() => visible, (value) => {
  emits('update:modelValue', value)
})

const draftBoxStyle = computed(() => {
  return {
    transform: `translate(${state.translateX}px, ${state.translateY}px)`
  }
})

onMounted(() => {
  const { remove } = listenerDraft()
  return () => {
    remove()
  }
})
</script>

<template>
  <div v-show="visible" ref="draftBox" :style="draftBoxStyle"
    class="select-none fixed right-2 bottom-14 bg-white rounded-md border border-primary shadow-md min-w-[240px] md:min-w-[340px]">
    <div class="relative text-center text-sm leading-[3] cursor-move font-bold">
      草稿纸
      <span class="absolute right-2 text-[#666] font-normal text-sm leading-[3] cursor-pointer"
        @click="visible = false">关闭</span>
    </div>
    <hr />
    <div class="py-1 border-none outline-none px-0.5">
      <textarea :spellcheck="false"
        class="block w-full min-h-[200px] md:min-h-[260px] p-1 text-sm outline-none resize-none"
        placeholder="示例：&#10;1-15&#10;ABCDA&#10;BBDDA&#10;BBCDA"></textarea>
    </div>
  </div>
</template>