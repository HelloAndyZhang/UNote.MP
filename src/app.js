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
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '我的优笔记',
      navigationBarTextStyle: 'black'
    },
    tabBar:{
        borderStyle:"white",
        position: "bottom",
        backgroundColor:'#ffffff',
        selectedColor:'#D9DCE0',
        list: [
          {
            pagePath: "pages/index/index",
            text: "列表",
            iconPath: "./assets/tab-bar/list_on.png",
            selectedIconPath: "./assets/tab-bar/list.png"
          },
          {
            pagePath: "pages/folder/index",
            text: "文件夹",
            iconPath: "./assets/tab-bar/folder_on.png",
            selectedIconPath: "./assets/tab-bar/folder.png"
          },
          {
            pagePath: "pages/ucenter/index",
            text: "我的",
            iconPath: "./assets/tab-bar/mine_on.png",
            selectedIconPath: "./assets/tab-bar/mine.png"
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
