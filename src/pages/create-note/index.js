import Taro, { Component } from '@tarojs/taro'
import { View, Text, Editor, RichText, Input,ScrollView } from '@tarojs/components'
import './index.scss'
import { delayQuerySelectorCtx } from '@/utils/dom'
import Utils from '@/utils/index'
import classNames from 'classnames';
export default class Folder extends Component {
    static options = {
        addGlobalClass: true
    }
    config = {
        navigationBarTitleText: '文件夹',
        enablePullDownRefresh:false,
    }
    constructor(props) {
        super(props)
        this.state = {
            editorFormat:{},
            formatlist:[{
                style:'icon-zitijiacu',
                bold:''
            },{
                style:'icon-zitibiaoti',
                italic:''
            },{
                style:'icon-zitixieti',
            },{
                style:'icon-zuoduiqi',
                align:'left'
            },{
                style:'icon-juzhongduiqi',
                align:'center'
            },{
                style:'icon-youduiqi',
                align:'right'
            },{
                style:'icon-zitixiahuaxian',
                underline:''
            },{
                style:'icon-youxupailie',
                list:'ordered'
            },{
                style:'icon-wuxupailie',
                list:'bullet'
            },{
                style:'icon-zuoyouduiqi',
                align:'justify'
            }]
        }
        this.editorCtx = null; // 编辑器上下文
    }
    //分享
    onShareAppMessage() {
        return {
            title: '我的优笔记',
        }
    }
    componentWillPreload() {

    }
    componentWillMount() {

    }
    handleEditorFormat(item){
        delete  item['style'];
        this.editorCtx.format(Object.values(item)[0], Object.values(item)[0])
    }
    onStatusChange(event){
        console.log(event)
        this.setState({
            editorFormat:event.detail
        })
        
    }
    async onEditorReady(){
        const res = await delayQuerySelectorCtx(this,'#editor');
        if(res){
            this.editorCtx = res.context
        }
    }
    //下拉刷新
    onPullDownRefresh() {

    }
    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    render() {
        let {formatlist} = this.state;
        return (
            <View className='page-create'>
                <View className='header'>
                    <ScrollView class="tool-bar" scrollX >
                        {
                            formatlist.map((item,index)=>{
                                return (
                                    <Text className={classNames('iconfont tool-bar__item',item.style) } onClick={this.handleEditorFormat.bind(this,item)} key={index}></Text>
                                )
                            })
                        }
                    </ScrollView>
                    <View className='save_btn'>
                        <Text className='iconfont  icon-fabusekuai '></Text>
                    </View>
                </View>
                <View className='title'>
                    <Input placeholder='请输入页面标题' className='input'></Input>
                </View>
                <View className='edit-content'>
                    <Editor id="editor" 
                        className="editor" 
                        placeholder="你的语言四季如春"
                        onStatusChange={this.onStatusChange.bind(this)}  
                        onReady={this.onEditorReady.bind(this)}>
                    </Editor>
                </View>
            </View>
        )
    }
}
