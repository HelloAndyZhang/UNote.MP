import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.scss'

import { uuid,  } from '@/utils/dom'


export default class Weather extends Component {
	static options = {
		addGlobalClass: true
	}
	static defaultProps ={
		options: [],
		isOpened: false,
	}
	constructor(props) {
		super(...arguments)
		const { isOpened } = props
		this.state = {
			componentId:uuid(),
			_isOpened: isOpened
		}
	}
    componentWillMount(){

    }


	componentWillReceiveProps(nextProps) {

	}

	render() {
		const rootClass = classNames('weather', this.props.className)
		return (
			<View
				id={`weather-${componentId}`}
				className={rootClass}
			 	>
				<View className="weather__sunny">
					<View className="sun"></View>
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
