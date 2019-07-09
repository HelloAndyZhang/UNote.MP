const objectToString = style => {
    if (style && typeof style === 'object') {
      let styleStr = ''
      Object.keys(style).forEach(key => {
        const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        styleStr += `${lowerCaseKey}:${style[key]};`
      })
      return styleStr
    } else if (style && typeof style === 'string') {
      return style
    }
    return ''
}
export{
    objectToString
}