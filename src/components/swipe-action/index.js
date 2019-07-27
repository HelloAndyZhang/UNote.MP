import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import _isNil from 'lodash/isNil'
import _isEmpty from 'lodash/isEmpty'
import _inRange from 'lodash/inRange'
import _isFunction from 'lodash/isFunction'

import { delayGetClientRect, delayGetScrollOffset, uuid, delayQuerySelector } from '@/utils/dom'


export default class SwipeAction extends Component {
	static options = {
		addGlobalClass: true
	}
	static defaultProps ={
		isTest: false,
		options: [],
		isOpened: false,
		disabled: false,
		autoClose: false
	}
	constructor(props) {
		super(...arguments)

		const { isOpened } = props

		this.endValue = 0
		this.startX = null
		this.startY = null
		this.maxOffsetSize = 0

		this.domInfo = {}
		this.isMoving = false
		this.isTouching = false

		this.state = {
			componentId:uuid(),
			offsetSize: 0,
			_isOpened: isOpened
		}
	}
    componentWillMount(){
        this.trrigerOptionsDomUpadte()
    }
	getDomInfo() {
		this.domInfo = {}
		return Promise.all([
			delayGetClientRect({
				self: this,
				delayTime: 0,
				selectorStr: `#swipeAction-${this.state.componentId}`
			}),
			delayGetScrollOffset({ delayTime: 0 })
		]).then(([rect, scrollOffset]) => {
			rect[0].top += scrollOffset[0].scrollTop
			rect[0].bottom += scrollOffset[0].scrollTop
			this.domInfo = rect[0]
		})
	}

	componentWillReceiveProps(nextProps) {
		const { isOpened } = nextProps
		const { _isOpened } = this.state

		if (isOpened !== _isOpened) {
			this._reset(isOpened)
		}
	}

	_reset(isOpened) {
		this.isMoving = false
		this.isTouching = false

		if (isOpened) {
			this.endValue = -this.maxOffsetSize
			this.setState({
				_isOpened: true,
				offsetSize: -this.maxOffsetSize
			})
		} else {
			this.endValue = 0
			this.setState({
				offsetSize: 0,
				_isOpened: false
			})
		}
	}

	computeTransform = value => {
		if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
			return !_isNil(value) ? `translate3d(${value}px,0,0)` : null
		}
		return value ? `translate3d(${value}px,0,0)` : null
	}

	handleOpened = () => {
		if (_isFunction(this.props.onOpened) && !this.state._isOpened) {
			this.props.onOpened()
		}
	}

	handleClosed = () => {
		if (_isFunction(this.props.onClosed) && this.state._isOpened) {
			this.props.onClosed()
		}
	}

	handleTouchStart = e => {
		const { clientX, clientY } = e.touches[0]
		if (this.props.disabled) return
		this.getDomInfo()
		this.startX = clientX
		this.startY = clientY
		this.isTouching = true
	}

	handleTouchMove = e => {
		if (_isEmpty(this.domInfo)) {
			return
		}

		const { startX, startY } = this
		const { top, bottom, left, right } = this.domInfo
		const { clientX, clientY, pageX, pageY } = e.touches[0]

		const x = Math.abs(clientX - startX)
		const y = Math.abs(clientY - startY)

		const inDom = _inRange(pageX, left, right) && _inRange(pageY, top, bottom)

		if (!this.isMoving && inDom) {
			this.isMoving =
				y === 0 || x / y >= Math.tan((45 * Math.PI) / 180).toFixed(2)
		}
		if (this.isTouching && this.isMoving) {
			e.preventDefault()
			const offsetSize = clientX - this.startX
			const isRight = offsetSize > 0
			if (this.state.offsetSize === 0 && isRight) return
			const value = this.endValue + offsetSize
			this.setState({
				offsetSize: value >= 0 ? 0 : value
			})
		}
	}

	handleTouchEnd = () => {
		this.isTouching = false
		const { offsetSize } = this.state
		this.endValue = offsetSize
		const breakpoint = this.maxOffsetSize / 2
		const absOffsetSize = Math.abs(offsetSize)
		if (absOffsetSize > breakpoint) {
			this._reset(true)
			return this.handleOpened()
		}

		this._reset()
		this.handleClosed()
	}

	handleDomInfo = ({ width }) => {
        
		const { _isOpened } = this.state
		this.maxOffsetSize = width
		this._reset(_isOpened)
	}

	handleClick = (item, index, ...arg) => {
		const { onClick, autoClose } = this.props

		if (_isFunction(onClick)) {
			onClick(item, index, ...arg)
		}
		if (autoClose) {
			this._reset()
			this.handleClosed()
		}
	}
	trrigerOptionsDomUpadte() {
		delayQuerySelector(
			this,
			`#swipeActionOptions-${this.state.componentId}`
		).then(res => {
			this.handleDomInfo(res[0])
		})
	}
	render() {
		const { offsetSize, componentId } = this.state
		const { options } = this.props
		const rootClass = classNames('swipe-action', this.props.className)
		const rootClassTwo = classNames('swipe-action__options')
		return (
			<View
				id={`swipeAction-${componentId}`}
				className={rootClass}
				onTouchMove={this.handleTouchMove}
				onTouchEnd={this.handleTouchEnd}
				onTouchStart={this.handleTouchStart}
			>
				<View
					className={classNames('swipe-action__content', {
						animtion: !this.isTouching
					})}
					style={{
						transform: this.computeTransform(offsetSize)
					}}
				>
					{this.props.children}
				</View>

				{Array.isArray(options) && options.length > 0 ?
					(
						<View
							id={`swipeActionOptions-${componentId}`}
							className={rootClassTwo}
						>
							{options.map((item, key) => (
								<View
									index={key}
									style={item.style}
									onClick={this.handleClick.bind(this, item, key)}
									className={classNames(
										'swipe-action__option',
										item.className
									)}
								>
									<Text className='option__text'>{item.text}</Text>
								</View>
							))}
						</View>
					) : null
				}
			</View>
		)
	}
}
SwipeAction.defaultProps = {
	isTest: false,
	options: [],
	isOpened: false,
	disabled: false,
	autoClose: false
  }
  
SwipeAction.propTypes = {
	isTest: PropTypes.bool,
	isOpened: PropTypes.bool,
	disabled: PropTypes.bool,
	autoClose: PropTypes.bool,
	options: PropTypes.arrayOf(
	  PropTypes.shape({
		text: PropTypes.string,
		style: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		className: PropTypes.oneOfType([
		  PropTypes.object,
		  PropTypes.string,
		  PropTypes.array
		])
	  })
	),
  
	onClick: PropTypes.func,
	onOpened: PropTypes.func,
	onClosed: PropTypes.func
  }