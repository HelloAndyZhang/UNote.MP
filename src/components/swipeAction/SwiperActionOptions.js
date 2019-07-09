import Taro,{Component} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import PropTypes from 'prop-types'
import classNames from 'classnames'

import _isNil from 'lodash/isNil'
import _isEmpty from 'lodash/isEmpty'
import _inRange from 'lodash/inRange'
import _isFunction from 'lodash/isFunction'

import { delayQuerySelector } from '@/utils/dom';
import {objectToString} from '@/utils/object';


export default class SwiperActionOptions extends Component {
    trrigerOptionsDomUpadte () {
      delayQuerySelector(
        this,
        `#swipeActionOptions-${this.props.componentId}`
      ).then(res => {
        this.props.onQueryedDom(res[0])
      })
    }  
    /**
     * 合并 style
     * @param {Object|String} style1
     * @param {Object|String} style2
     * @returns {String}
     */
    mergeStyle (style1, style2) {
      if ((style1 && typeof style1 === 'object')
        && (style2 && typeof style2 === 'object')
      ) {
        return Object.assign({}, style1, style2)
      }
      return objectToString(style1) + objectToString(style2)
    }
    componentDidMount () {
      this.trrigerOptionsDomUpadte()
    }
  
    componentWillReceiveProps (nextProps) {
      if (nextProps.options !== this.props.options) {
        this.trrigerOptionsDomUpadte()
      }
    }
  
    render () {
      const rootClass = classNames(
        'at-swipe-action__options',
        this.props.className
      )
  
      return (
        <View
          id={`swipeActionOptions-${this.props.componentId}`}
          className={rootClass}
        >
          {this.props.children}
        </View>
      )
    }
  }
  