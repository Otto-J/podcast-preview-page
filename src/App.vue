<template>
  <nav class="fixed top-0 left-0 w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0 flex items-center">
          <a href="#" class="font-bold text-lg text-gray-800">Logo</a>
        </div>
        <div class="text-xl text-white font-bold">Web Worker 播客</div>

        <div class="flex items-center">
          <a
            href="#"
            class="text-white hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >About</a
          >
        </div>
      </div>
    </div>
  </nav>
  <!-- style="background-color: #ffefc6" -->
  <div
    class="w-full h-screen lg:pt-10 bg-yellow-400 flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500"
  >
    <div class="w-full lg:w-10/12 lg:max-w-4xl md:w-full">
      <p class="text-center text-white mb-3">这是《{{ info.title }}》播客试听</p>
      <Player>
        <video-comp :poster="Cover">
          <source :data-src="info.url" type="audio/mp3" />
          <track default kind="subtitles" :src="info.vtt" srclang="zh" label="zh" />
        </video-comp>
        <DefaultUi noClickToPlay> </DefaultUi>
      </Player>
    </div>
  </div>
  <footer
    class="fixed bottom-0 left-0 w-full bg-cyan-100 bg-opacity-50 backdrop-filter backdrop-blur-lg"
  >
    <p class="text-center p-1 text-white">
      备案号 © Web Worker 2021-2023 <a href="https://beian.miit.gov.cn/">京ICP备17060663号-3</a>
    </p>
  </footer>
</template>
<script lang="ts" setup>
// Default theme. ~960B
import '@vime/core/themes/default.css'

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css'
import Cover from '@/assets/cover.jpg'

import { Player, DefaultUi, Video as VideoComp, Audio as AudioComp } from '@vime/vue-next'

import { Cloud } from 'laf-client-sdk'
import { ref } from 'vue'

// const pass = ref('')

const info = ref({
  title: '29',
  url: '',
  vtt: ''
})

// 弹窗提示输入 pass
// const pass = ref('vercel')
const pass = ref(prompt('请输入密码'))

const getInfoByPassword = async () => {
  const cloud = new Cloud({
    // 这里 APPID 需要换成对应的 APPID
    baseUrl: 'https://bh5nzo.laf.run',
    // 这里是访问策略的入口地址，如果没有访问策略可不填
    dbProxyUrl: '/proxy/read-podcast',
    // 请求时带的 token，可空
    // getAccessToken: () => localStorage.getItem("access_token"),
    getAccessToken: () => ''
  })
  const db = cloud.database()

  if (!pass.value) return
  const res = await db
    .collection('podcast-preview')
    .where({
      password: pass.value
    })
    .get()
  console.log(res)
  if (res.ok && res.data.length > 0) {
    const data = res.data[0]
    info.value = {
      title: data.title,
      url: data.url,
      vtt: data.vtt
    }
  } else {
    alert('密码错误')
  }
}

getInfoByPassword()
</script>

<style></style>
