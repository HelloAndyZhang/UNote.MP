import Taro, { Component } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import './index.scss'
import Utils from '@/utils/index'
import classNames from 'classnames';
export default class Note extends Component {
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
            nodes:[],
            title:'hi'
        }
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
    handleClickRichText(){

    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { 
        const article = Utils.session('article');
        this.setState({
            nodes:article.nodes,
            title:article.title
        })
    }

    componentDidHide() { }
    render() {
        const {nodes,title } = this.state;
        return (
            <View className='page-detail'>
                <View className='title'>
                    {title}
                </View>
                <RichText nodes={nodes} onClick={this.handleClickRichText.bind(this)} className="editor"></RichText>
            </View>
        )
    }
}
