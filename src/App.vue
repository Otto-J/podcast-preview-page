<template>
  <nav class="fixed top-0 left-0 w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0 flex items-center">
          <a href="#" class="font-bold text-lg text-gray-800">Logo</a>
        </div>
        <div class="text-xl text-white font-bold">Web Worker 播客</div>

        <div class="flex items-center">
          <!-- <a
            href="#"
            class="text-white hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >导入本地视频</a
          > -->
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
      <!-- <div class="flex justify-center align-top"> -->
      <Player>
        <video-comp :poster="Cover">
          <source :data-src="info.url" type="audio/mp3" />
          <track default kind="subtitles" :src="info.vtt" srclang="zh" label="zh" />
        </video-comp>
        <DefaultUi />
      </Player>
      <!-- <div>
          <pre>{{ info.content }}</pre>
        </div> -->
      <!-- </div> -->

      <div class="flex justify-center mt-4">
        <t-space>
          <t-upload :auto-upload="false" :draggable="true" accept="audio/*" @change="videoChange" />
          <t-upload :auto-upload="false" :draggable="true" accept=".srt" @change="srtFileChange" />
        </t-space>
      </div>
      <!-- <t-affix v-if="false" ref="affix" :offset-top="40">
        <t-card style="width: 500px; height: 400px; overflow: auto">
          <pre>{{ info.content }}</pre>
        </t-card>
      </t-affix> -->
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
//  import { tr, ru } from './player-lang';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css'
import Cover from '@/assets/cover.jpg'

import { Player, DefaultUi, Video as VideoComp, Audio as AudioComp } from '@vime/vue-next'

import { Cloud } from 'laf-client-sdk'
import { ref } from 'vue'

const info = ref({
  title: '635',
  url: '',
  vtt: '',
  content: ''
})

const videoChange = (e: any) => {
  // console.log(3, e)
  const [{ raw: file }] = e
  // console.log(file)

  var videoURL = URL.createObjectURL(file)
  info.value.url = videoURL
}

const srtFileChange = (e: any) => {
  // console.log(e)
  const [{ raw: file }] = e
  // 先初始化，定义 onload 行为，最后传递文件
  var reader = new FileReader()
  reader.onload = function (e) {
    if (e.target) {
      var srtContent = e.target.result as string
      // console.log('srt 内容', srtContent)
      var vttContent = coverSrtToVtt(srtContent)
      console.log('vtt 内容:\n', vttContent)
      info.value.content = vttContent

      var vttBlob = new Blob([vttContent], { type: 'text/vtt' })
      // 可以将vttBlob保存到本地或者上传到服务器
      info.value.vtt = URL.createObjectURL(vttBlob)
    }
  }

  reader.readAsText(file)
}

const coverSrtToVtt = (srt: string) => {
  // 第一行添加 WEBVTT\n\n
  let vtt = 'WEBVTT\n\n'

  // 正则表达式替换所有的 (\d{2}),(\d{3}) 为 $1.$2
  vtt += srt.replace(/(\d{2}),(\d{3})/g, '$1.$2')
  return vtt
}

// const pass = ref('')

// 弹窗提示输入 pass
// const pass = ref('vercel')
// const pass = ref(prompt('请输入密码'))

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

  const pass = ref('')

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

// getInfoByPassword()
</script>

<style></style>
