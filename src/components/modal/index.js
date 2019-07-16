import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import PropTypes from 'prop-types'
import classNames from 'classnames'

import _isFunction from 'lodash/isFunction'

import { handleTouchScroll } from '@/utils/dom'
export default class Modal extends Component {
    static options = {
        addGlobalClass: true
    }
    constructor(props) {
        super(...arguments)

        const { isOpened } = props
        this.state = {
            _isOpened: isOpened
        }
    }

    componentWillReceiveProps(nextProps) {
        const { isOpened } = nextProps

        if (this.props.isOpened !== isOpened) {
            handleTouchScroll(isOpened)
        }

        if (isOpened !== this.state._isOpened) {
            this.setState({
                _isOpened: isOpened
            })
        }
    }

    handleClickOverlay = () => {
        if (this.props.closeOnClickOverlay) {
            this.setState(
                {
                    _isOpened: false
                },
                this.handleClose
            )
        }
    }

    handleClose = () => {
        if (_isFunction(this.props.onClose)) {
            this.props.onClose()
        }
    }

    handleCancel = () => {
        if (_isFunction(this.props.onCancel)) {
            this.props.onCancel()
        }
    }

    handleConfirm = () => {
        if (_isFunction(this.props.onConfirm)) {
            this.props.onConfirm()
        }
    }

    handleTouchMove = e => {
        e.stopPropagation()
    }

    render() {
        const { _isOpened } = this.state
        const { title, content, cancelText, confirmText} = this.props
        const rootClass = classNames(
            'modal',
            {
                'modal--active': _isOpened
            },
            this.props.className
        )
        
        if (title || content) {
            const isRenderAction = cancelText || confirmText
            return (
                <View className={rootClass}>
                    <View
                        onClick={this.handleClickOverlay}
                        className='modal__overlay'
                    />
                    <View className='modal__container'>
                        {title && (
                            <View className={classNames('modal__header')}><Text>{title}</Text></View>
                        )}
                        {content ? 
                            <ScrollView scrollY className='modal__content'>
                                <View className='content-simple'>
                                    <Text>{content}</Text>
                                </View>
                            </ScrollView>
                            :
                            this.props.children
                        }
                        {isRenderAction && (
                            <View className={classNames('modal__footer', { 'modal__footer--simple': this.props.isSimple })}>
                                <View className='modal__action'>
                                    {cancelText && (
                                        <Button onClick={this.handleCancel}>{cancelText}</Button>
                                    )}
                                    {confirmText && (
                                        <Button onClick={this.handleConfirm}>{confirmText}</Button>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            )
        }

        return (
            <View onTouchMove={this.handleTouchMove} className={rootClass}>
                <View className='modal__overlay' onClick={this.handleClickOverlay} />
                <View className='modal__container'>{this.props.children}13131313</View>
            </View>
        )
    }
}

Modal.defaultProps = {
    closeOnClickOverlay: true
}

Modal.propTypes = {
    title: PropTypes.string,
    isOpened: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
    content: PropTypes.string,
    closeOnClickOverlay: PropTypes.bool,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string
}
