import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.scss'

import { uuid,delayQuerySelectorCtx,delayQuerySelector} from '@/utils/dom'

export default class Weather extends Component {
	static options = {
		addGlobalClass: true
	}
	static defaultProps = {
		options: [],
		isOpened: false,
	}
	constructor(props) {
		super(...arguments)
		this.state = {

		}
	}
	async componentWillMount() {

	}
	componentDidMount(){

	}
	render() {
		const rootClass = classNames('weather')
		return (
			<View
				className={rootClass}
			>
				<View className="weather__rain">

				</View>
			</View>
		)
	}
}
Weather.defaultProps = {
	isTest: false,
	options: [],
}

Weather.propTypes = {
	isOpened: PropTypes.bool,
}
