let ctx = {
  selected: new Set([])
}

$(document).ready(() => {
  $('html').click(function() {
    if (ctx.selected.size > 0) {
      ctx.selected.forEach(node => node.removeClass('selected'));
    }
    ctx.selected = new Set([])
  })

  let root =
    vertical([
      horizontal([
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
