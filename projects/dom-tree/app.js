
Set.prototype.any = function (pred) {
  for (let ele of this) {
    if (pred(ele)) return true;
  }
  return false;
};

let ctx = {
  selected: new Set([]),
  root: undefined
}

function thenClearSelected(fn) {
  ctx.selected.forEach(dom => dom.removeClass('selected'))
  fn()
  ctx.selected.clear()
}

$(document).ready(() => {
  $('html').click(function() {
    if (ctx.selected.size > 0) {
      ctx.selected.forEach(node => node.removeClass('selected'));
    }
    ctx.selected = new Set([])
  })

  const mergeBtn = $('button[name = "merge"]')
  mergeBtn.on('click', mergeSelected)

  const unwrapBtn = $('button[name = "unwrap"]')
  unwrapBtn.on('click', unwrapSelected)

  const surroundHorizontallyBtn = $('button[name = "surround-horizontal"]')
  surroundHorizontallyBtn.on('click', surroundHorizontally)

  const surroundVerticallyBtn = $('button[name = "surround-vertical"]')
  surroundVerticallyBtn.on('click', surroundVertically)

  ctx.root =
    vertical([
      horizontal([
        circle(),
        horizontal([
          square(),
          circle()
        ])
      ]),
      horizontal([
        vertical([
          square(),
          square()
        ]),
        vertical([
          square(),
          circle(),
          square()
        ])
      ])
    ])
})

function mergeSelected(e) {
  e.stopPropagation()

  thenClearSelected(() => {
    for (let parent of ctx.selected) {
      for (let child of ctx.selected) {
        if (child.parent().is(parent)) {
          if ((child.hasClass('horizontal') && parent.hasClass('horizontal'))
           || (child.hasClass('vertical') && parent.hasClass('vertical'))) {
             let grandchildren = child.children('div')
             child.replaceWith(grandchildren)
          }
        }
      }
    }
  })
}

function surroundHorizontally(e) {
  e.stopPropagation()

  thenClearSelected(() => {
    ctx.selected.forEach(dom => {
      let cloned = dom.clone()
      applyMouseEventsRec(cloned)
      dom.replaceWith(horizontal([cloned]))
    })
  })
}

function unwrapSelected(e) {
  e.stopPropagation()

  thenClearSelected(() => {
    ctx.selected.forEach(dom => {
      if (dom.children('div').length == 1) {
        let cloned = dom.children('div').clone()
        applyMouseEventsRec(cloned)
        dom.replaceWith(cloned)
      }
    })
  })
}

function surroundVertically(e) {
  e.stopPropagation()

  thenClearSelected(() => {
    ctx.selected.forEach(dom => {
      let cloned = dom.clone()
      applyMouseEventsRec(cloned)
      dom.replaceWith(vertical([cloned]))
    })
  })
}
