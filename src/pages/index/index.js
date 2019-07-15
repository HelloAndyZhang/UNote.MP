import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import SwipeAction from '@/components/swipe-action/index';
import './index.scss'

export default class Index extends Component {
    static options = {
        addGlobalClass: true
    }
    config = {
        navigationBarTitleText: '我的优笔记',
        disableScroll: true
    }
    constructor(props) {
        super(props)
        this.state = {
            config: [{
                options: [{
                    text: '取消',
                    style: {
                        backgroundColor: '#6190E8'
                    }
                }, {
                    text: '确认',
                    style: {
                        backgroundColor: '#FF4949'
                    }
                }],
                isOpened: false,
                title: 'AtSwipeAction 一般使用场景'
            }, {
                options: [{
                    text: '取消',
                    style: {
                        backgroundColor: '#6190E8'
                    }
                }, {
                    text: '确认',
                    style: {
                        backgroundColor: '#FF4949'
                    }
                }],
                isOpened: false,
                title: 'AtSwipeAction 一般使用场景'
            }, {
                options: [{
                    text: '取消',
                    style: {
                        backgroundColor: '#6190E8'
                    }
                }, {
                    text: '确认',
                    style: {
                        backgroundColor: '#FF4949'
                    }
                }],
                isOpened: false,
                title: 'AtSwipeAction 一般使用场景'
            }, {
                options: [{
                    text: '取消',
                    style: {
                        backgroundColor: '#6190E8'
                    }
                }, {
                    text: '确认',
                    style: {
                        backgroundColor: '#FF4949'
                    }
                }],
                isOpened: false,
                title: 'AtSwipeAction 一般使用场景'
            },]
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
    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }
    handleSingle(index) {
        const config = this.state.config.map((item, key) => {
            item.isOpened = key === index
            return item
        })
        this.setState({
            config
        })
    }
    handleClick = (item, key, e) => {
        console.log('触发了点击', item, key, e)
    }
    componentDidHide() { }
    render() {
        let { config } = this.state;
        return (
            <View className='index'>
                {
                    config.map((item, index) => (
                        <SwipeAction
                            key={index}
                            onOpened={this.handleSingle.bind(this, index)}
                            isOpened={item.isOpened}
                            options={item.options}
                            onClick={this.handleClick}
                            className='u-cell-item'>
                            <View className='title'>{item.title}</View>
                            <View className='time'>05-18 17:18</View>
                        </SwipeAction>
                    ))
                }
            </View>
        )
    }
}
