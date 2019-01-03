const text = document.getElementById('text')
const spacingControl = document.getElementById('spacing-control')
const sizeControl = document.getElementById('size-control')

function attachStyleUpdater(attr, slider, unit) {
  slider.oninput = () => {
    text.style[attr] = slider.value + (unit || '')
  }
  slider.oninput()
}

attachStyleUpdater('letter-spacing', spacingControl, 'rem')
attachStyleUpdater('font-size', sizeControl, 'rem')
