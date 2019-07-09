import Taro, { Component } from '@tarojs/taro'
import { View, Text,Editor ,RichText } from '@tarojs/components'
import { delayQuerySelectorCtx } from '@/utils/dom';
import './index.scss'

let config =[{
  title:'加粗',
}]
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }                   
  constructor(){
    super()
    this.state ={
        formats:[],
        nodes: []

    }
    this.editorCtx = null; // 编辑器上下文
  }
  //分享
  onShareAppMessage() {
    return {
      title:'我的优笔记',
    }
  }
  componentWillPreload () {
    
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  goAbout(){
    // this.$preload('key', 'val')
  }
  onStatusChange(event){
    const formats = event.detail;
    this.setState({
      formats,
    })
  }
  async onEditorReady(){
    let res =  await delayQuerySelectorCtx(this,'#editor');
    if(res){
      console.log(res);
       this.editorCtx = res.context
     }
  }
  handleEditorCtx(){
    this.editorCtx.getContents({success:(res)=>{ 
        console.log(res) 
        this.setState({
          nodes:res.html
        })
      }})
  }

  render () {
    let placeholder = '留下生活留下感动'
    return (
      <View className='index'>
        <Text className='text'> 1313131</Text>
        <Editor
          id="editor"
          class="editor"
          placeholder={placeholder}
          showImgSize
          showImgToolbar
          showImgResize
          onStatusChange={this.onStatusChange.bind(this)}
          onReady={this.onEditorReady.bind(this)}>
        </Editor>
        <View className='btn'onClick={this.handleEditorCtx.bind(this)} > 保存</View>
        <RichText nodes={this.state.nodes} />
      </View>
    )
  }
}
