import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import '@tarojs/async-await'
import './styles/index.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/folder/index',
      'pages/ucenter/index',
      'pages/create-note/index',
      'pages/note-detail/index',
      'pages/auth/index'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '我的优笔记',
      navigationBarTextStyle: 'black',
    },
    tabBar:{
        color:'#D9DCE0',
        borderStyle:"black",
        position: "bottom",
        backgroundColor:'#ffffff',
        selectedColor:'#555555',
        list: [
          {
            pagePath: "pages/index/index",
            text: "列表",
            iconPath: "./assets/tab-bar/list.png",
            selectedIconPath: "./assets/tab-bar/list_on.png"
          },
          {
            pagePath: "pages/folder/index",
            text: "文件夹",
            iconPath: "./assets/tab-bar/folder.png",
            selectedIconPath: "./assets/tab-bar/folder_on.png"
          },
          {
            pagePath: "pages/ucenter/index",
            text: "我的",
            iconPath: "./assets/tab-bar/mine.png",
            selectedIconPath: "./assets/tab-bar/mine_on.png"
          },
        ]
      }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
