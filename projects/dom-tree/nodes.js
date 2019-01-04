
function applyMouseEvents(selected) {
  selected
    .mouseover(function(e) {
      e.stopPropagation()
      const parent = $(this).parent()
      if (!parent.is('#tree-container')) {
        parent.removeClass('tree-ele-highlight')
        parent.addClass('tree-ele-no-highlight')
      }
      $(this).addClass('tree-ele-highlight')
      $(this).removeClass('tree-ele-no-highlight')
    })
    .mouseout(function() {
      $(this).addClass('tree-ele-no-highlight')
      $(this).removeClass('tree-ele-highlight')
    })
    .click(function(e) {
      e.stopPropagation()

      // Deselect if background is clicked, or if the selected item is clicked.
      if (ctx.selected) {
        if (ctx.selected.is($(this))) {
          ctx.selected.removeClass('selected')
          ctx.selected = null;
        } else {
          ctx.selected.removeClass('selected')
          ctx.selected = $(this).addClass('selected')
        }
      } else {
        ctx.selected = $(this).addClass('selected')
      }
    })
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

function composite(children, type) {
  const dom = $('<div>')
  dom.addClass('tree-ele-no-highlight')
  dom.html(type)
  dom.data('children', children)
  children.forEach(child => dom.append(child))
  applyMouseEvents(dom)
  $('#tree-container').append(dom)
  return dom
}

function vertical(children) {
  const dom = composite(children, 'vertical')
  dom.addClass('vertical')
  return dom
}

function horizontal(children) {
  const dom = composite(children, 'horizontal')
  dom.addClass('horizontal')
  return dom
}
