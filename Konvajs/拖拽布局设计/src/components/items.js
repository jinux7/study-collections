export const imageItem = { 
  type: 'image', 
  name: '图片元素', 
  imgUrl: '/layoutByCanvas/1.jpg',
  props: [
    {
      type: 'input',
      label: '文本前缀',
      propName: 'prefixText',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入文本前缀'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '展示的文本',
      propName: 'text',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入展示的文本'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '提示词',
      propName: 'placeholder',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'color',
      label: '填充色',
      propName: 'fill',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
  ],
}

export const videoItem = { 
  type: 'video', 
  name: '视频元素', 
  imgUrl: '/layoutByCanvas/2.jpg',
  props: [
    {
      type: 'input',
      label: '文本前缀',
      propName: 'prefixText',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入文本前缀'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '展示的文本',
      propName: 'text',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入展示的文本'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '提示词',
      propName: 'placeholder',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'color',
      label: '填充色',
      propName: 'fill',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
  ],
}

export const textItem = { 
  type: 'text', 
  name: '文本元素', 
  imgUrl: '/layoutByCanvas/3.jpg',
  props: [
    {
      type: 'input',
      label: '文本前缀',
      propName: 'prefixText',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入文本前缀'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '展示的文本',
      propName: 'text',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入展示的文本'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '提示词',
      propName: 'placeholder',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'color',
      label: '填充色',
      propName: 'fill',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
  ],
}

export const weatherItem = { 
  type: 'weather', 
  name: '天气元素', 
  imgUrl: '/layoutByCanvas/4.jpg',
  props: [
    {
      type: 'input',
      label: '文本前缀',
      propName: 'prefixText',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入文本前缀'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '展示的文本',
      propName: 'text',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入展示的文本'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '提示词',
      propName: 'placeholder',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'color',
      label: '填充色',
      propName: 'fill',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
  ],
}

export const clockItem = { 
  type: 'clock', 
  name: '时钟元素', 
  imgUrl: '/layoutByCanvas/5.jpg',
  props: [
    {
      type: 'input',
      label: '文本前缀',
      propName: 'prefixText',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入文本前缀'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '展示的文本',
      propName: 'text',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入展示的文本'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '提示词',
      propName: 'placeholder',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'color',
      label: '填充色',
      propName: 'fill',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
  ],
}

export const worldclockItem = {
  type: 'worldclock', 
  name: '世界时钟元素', 
  imgUrl: '/layoutByCanvas/6.jpg',
  props: [
    {
      type: 'input',
      label: '文本前缀',
      propName: 'prefixText',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入文本前缀'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '展示的文本',
      propName: 'text',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入展示的文本'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'input',
      label: '提示词',
      propName: 'placeholder',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
    {
      type: 'color',
      label: '填充色',
      propName: 'fill',
      rules: [
        { validator: (rule, value, callback) => {
          callback();
          return ;
          if (!value) {
            callback(new Error('请输入提示词'))
          }else {
            callback();
          }
        },  
        trigger: 'blur' }
      ]
    },
  ],
}

export const typeMap = {
  image: imageItem,
  video: videoItem,
  text: textItem,
  weather: weatherItem,
  clock: clockItem,
  worldclock: worldclockItem
}
// export const carouselItem = { 
//   type: 'carousel', 
//   name: 'carousel', 
//   imgUrl: '/layoutByCanvas/2.jpg',
//   props: [
//     {
//       type: 'input',
//       label: '轮播prop1',
//       propName: 'carouselProp1',
//       rules: [
//         { required: true, validator: (rule, value, callback) => {
//           if (!value) {
//             callback(new Error('请输入'))
//           }else if(!/^[1-9]\d*$/g.test(value)) {
//             callback(new Error('请输入正整数'))
//           }else {
//             callback();
//           }
//         },  
//         trigger: 'blur' }
//       ]
//     },
//     {
//       type: 'input',
//       label: '轮播prop2',
//       propName: 'carouselProp2',
//       rules: [
//         { required: true, validator: (rule, value, callback) => {
//           if (!value) {
//             callback(new Error('请输入'))
//           }else if(!/^[1-9]\d*$/g.test(value)) {
//             callback(new Error('请输入正整数'))
//           }else {
//             callback();
//           }
//         },  
//         trigger: 'blur' }
//       ]
//     }
//   ],
// }