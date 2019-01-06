
function applyMouseEvents(selected) {
  selected
    .mouseover(domNodeMouseOver)
    .mouseout(domNodeMouseOut)
    .click(domNodeOnClick)
}

function domNodeMouseOver(e) {
  e.stopPropagation()
  const parent = $(this).parent()
  if (!parent.is('#tree-container')) {
    parent.removeClass('tree-ele-highlight')
    parent.addClass('tree-ele-no-highlight')
  }
  $(this).addClass('tree-ele-highlight')
  $(this).removeClass('tree-ele-no-highlight')
}

function domNodeMouseOut() {
  $(this).addClass('tree-ele-no-highlight')
  $(this).removeClass('tree-ele-highlight')
}

function domNodeOnClick(e) {
  e.stopPropagation()

  if (ctx.selected.any(dom => $(this).is(dom))) {
    ctx.selected.delete($(this))
    $(this).removeClass('selected')
  } else {
    ctx.selected.add($(this))
    $(this).addClass('selected')
  }
}

function atom() {
  const dom = $('<div>')
  dom.addClass('tree-ele-no-highlight atom')
  applyMouseEvents(dom)
  $('#tree-container').append(dom)
  return dom
}

function square() {
  const dom = atom()
  dom.addClass('square')
  dom.html('<span>sq</span>')
  return dom
}

function circle() {
  const dom = atom()
  dom.addClass('circle')
  dom.html('<span>cr</span>')
  return dom
}

function composite(children, html) {
  const dom = $('<div>')
  dom.addClass('tree-ele-no-highlight')
  dom.html(html)
  dom.data('children', children)
  children.forEach(child => dom.append(child))
  applyMouseEvents(dom)
  $('#tree-container').append(dom)
  return dom
}

function vertical(children) {
  const dom = composite(children, '<span>vertical</span>')
  dom.addClass('vertical')
  return dom
}

function horizontal(children) {
  const dom = composite(children, '<span>horizontal</span>')
  dom.addClass('horizontal')
  return dom
}
