
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

$(document).ready(() => {
  $('html').click(function() {
    if (ctx.selected.size > 0) {
      ctx.selected.forEach(node => node.removeClass('selected'));
    }
    ctx.selected = new Set([])
  })

  const mergeBtn = $('#tool-bar button[name = "merge"]')
  mergeBtn.on('click', mergeSelected)

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

function mergeSelected() {
  for (let parent of ctx.selected) {
    for (let child of ctx.selected) {
      if (child.parent().is(parent)) {
        if ((child.hasClass('horizontal') && parent.hasClass('horizontal'))
         || (child.hasClass('vertical') && parent.hasClass('vertical'))) {
           let grandchildren = child.children('div')
           child.replaceWith(grandchildren)
           return
        }
      }
    }
  }
}
