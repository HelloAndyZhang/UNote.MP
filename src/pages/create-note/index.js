import Taro, { Component } from '@tarojs/taro'
import { View, Text, Editor, RichText, Input, ScrollView } from '@tarojs/components'
import './index.scss'
import { delayQuerySelectorCtx } from '@/utils/dom'
import Utils from '@/utils/index'
import classNames from 'classnames';
import http from '@/utils/http';
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
            }],
            title:''
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
	componentDidShow() {
		let token = Utils.session('token');

		let {isDir,dirId } = this.$router.params;
		this.setState({
			isDir:isDir||0,
			dirId:dirId||0,
			token,
		})
	}

    handleEditorFormat(item) {
        this.editorCtx.format(item.key, item.value)
    }
    onStatusChange(event) {
      if( Object.keys(event.detail).length>0){
          this.setState({
              editorFormat: event.detail
          })
        }
    }
    async onEditorReady() {
        const res = await delayQuerySelectorCtx(this, '#editor');
        if (res) {
            this.editorCtx = res.context
        }
    }
    handleInputTitle(event){
        this.setState({
            title:event.target.value
        })
    }
    //保存文章
    handleSaveArticle() {
		let { title,isDir,dirId,token} = this.state;
        this.editorCtx.getContents({
            success:async (res)=> {
                if(res.errMsg == 'ok'){
					let config={
						url:'/api/note/create',
						data:{
							title,
							content:res.html,
							isDir,
							dirId
						},
						isLoad:true,
						headers:{
							Authorization:token
						},
					}
					let $res= await http.POST(config);
					if($res.code == 200){
						Utils.msg('创建成功!')
						setTimeout(()=>{
							Taro.redirectTo({
								url:`/pages/note-detail/index?id=${$res.data.id}`
							})
						},300)
					}
                }
            }
        })
    }

    componentDidMount() { }

    componentWillUnmount() { }


    componentDidHide() { }
    render() {
        let { formatlist,editorFormat } = this.state;
        return (
            <View className='page-create'>
                <View className='header'>
                    <ScrollView class="tool-bar" scrollX >
                        {
                            formatlist.map((item, index) => {
                                return (
                                    <Text className={classNames('iconfont tool-bar__item', item.style ,{ 'tool-bar__item': editorFormat[item.key] != '' ? true:false } )} onClick={this.handleEditorFormat.bind(this, item)} index={index}></Text>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <View className='edit-content'>
                    <View className='title'>
                        <Input placeholder='请输入标题' className='input' onInput={this.handleInputTitle.bind(this)}   placeholderClass='placeholderClass'></Input>
                    </View>
                    <Editor id="editor"
                        className="editor"
                        placeholder="你的语言四季如春"
                        onstatuschange={this.onStatusChange.bind(this)}
                        onReady={this.onEditorReady.bind(this)}>
                    </Editor>
                </View>
                <View className='plane_btn' onClick={this.handleSaveArticle.bind(this)}>
                        <Text className='iconfont  icon-fabusekuai'></Text>
                  </View>
            </View>
        )
    }
}
