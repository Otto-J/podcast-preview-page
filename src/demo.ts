import { ref } from 'vue'

const info = ref({})

// check password
const checkPassword = (res: any) => {
  // log res
  console.log(res)
  // check if ok
  if (res.ok) {
    // check if data length > 0
    if (res.data.length > 0) {
      // get data of first item
      const data = res.data[0]
      // set info
      info.value = {
        title: data.title,
        url: data.url,
        vtt: data.vtt
      }
    } else {
      // show error message
      alert('密码错误')
    }
  } else {
    // show error message
    alert('出错了')
  }
}

// 写一个函数，接受 a b参数，数字想加返回结果
const add = (a: number, b: number) => {
  return a + b
}
