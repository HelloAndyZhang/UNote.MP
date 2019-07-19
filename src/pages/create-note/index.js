import Taro, { Component } from '@tarojs/taro'
import { View, Text, Editor, RichText, Input, ScrollView } from '@tarojs/components'
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
        enablePullDownRefresh: false,
    }
    constructor(props) {
        super(props)
        this.state = {
            editorFormat: {},
            formatlist: [{
                style: 'icon-zitijiacu',
                key: 'bold',
                value: ''
            }, {
                style: 'icon-zitibiaoti',
                key: 'italic',
                value: ''
            }, {
                style: 'icon-zitixieti',
                key: 'italic',
                value: ''
            }, {
                style: 'icon-zuoduiqi',
                key: 'align',
                value: 'left'
            }, {
                style: 'icon-juzhongduiqi',
                key: 'align',
                value: 'center'
            }, {
                style: 'icon-youduiqi',
                key: 'align',
                value: 'right'
            }, {
                style: 'icon-zitixiahuaxian',
                key: 'underline',
                value: ''
            }, {
                style: 'icon-youxupailie',
                key: 'list',
                value: 'ordered'
            }, {
                style: 'icon-wuxupailie',
                key: 'list',
                value: 'bullet'
            }, {
                style: 'icon-zuoyouduiqi',
                key: 'align',
                value: 'justify'
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
    handleEditorFormat(item) {
        console.log(item)
        this.editorCtx.format(item.key, item.value)
    }
    onStatusChange(event) {
        console.log(event)
        this.setState({
            editorFormat: event.detail
        })
    }
    async onEditorReady() {
        const res = await delayQuerySelectorCtx(this, '#editor');
        if (res) {
            console.log(res)
            console.log('1313')
            this.editorCtx = res.context
        }
    }
    handleSaveArticle() {
        this.editorCtx.getContents({
            success(res) {
                console.log(res)
            }
        })
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    render() {
        let { formatlist } = this.state;
        return (
            <View className='page-create'>
                <View className='header'>
                    <ScrollView class="tool-bar" scrollX >
                        {
                            formatlist.map((item, index) => {
                                return (
                                    <Text className={classNames('iconfont tool-bar__item', item.style)} onClick={this.handleEditorFormat.bind(this, item)} key={index}></Text>
                                )
                            })
                        }
                    </ScrollView>
                    <View className='save_btn' onClick={this.handleSaveArticle.bind(this)}>
                        <Text className='iconfont  icon-fabusekuai'></Text>
                    </View>
                </View>
                <View className='edit-content'>
                    <View className='title'>
                        <Input placeholder='请输入标题' className='input'></Input>
                    </View>
                    <Editor id="editor"
                        className="editor"
                        placeholder="你的语言四季如春"
                        onstatuschange={this.onStatusChange.bind(this)}
                        onReady={this.onEditorReady.bind(this)}>
                    </Editor>
                </View>
            </View>
        )
    }
}
