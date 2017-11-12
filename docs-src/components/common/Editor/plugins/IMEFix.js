// Workaround for text deleted on IME input.
// Only tested for Japanese IME and Latest Chrome.
// https://github.com/ianstormtaylor/slate/blob/master/src/components/content.js#L603
export default (options = {}) => {
  let isIME = false
  return {
    onKeyDown(e, data, change, editor) {
      const code = e.nativeEvent.code.toLowerCase()
      if (data.code === 229 && code === 'enter') {
        isIME = true
        return change
      }
    },
    onBeforeInput(e, data, change) {
      if (isIME) {
        const text = e.nativeEvent.data
        e.preventDefault()
        isIME = false
        change.insertText(text)
        return true
      }
    }
  }
};
