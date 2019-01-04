let ctx = {
  selected: null
}

$(document).ready(() => {
  $('html').click(function() {
    if (ctx.selected) {
      ctx.selected.removeClass('selected')
    }
    ctx.selected = null;
  })

  let root =
    vertical([
      horizontal([horizontal([square(), circle()])]),
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
