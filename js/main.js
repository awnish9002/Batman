(function () {
  const hero = document.getElementById('hero')
  const canvas = document.getElementById('hero-canvas')
  const ctx = canvas.getContext('2d')

  const TRAIL_LENGTH = 60
  const HEAD_RADIUS = 180

  const mouse = { x: -9999, y: -9999 }
  const smooth = { x: -9999, y: -9999 }
  let trail = []

  const bottom = new Image()
  const top = new Image()

  const offscreen = document.createElement('canvas')
  const off = offscreen.getContext('2d')

  const resize = () => {
    canvas.width = hero.offsetWidth
    canvas.height = hero.offsetHeight
    offscreen.width = canvas.width
    offscreen.height = canvas.height
  }
  resize()
  window.addEventListener('resize', resize)

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  })

  const draw = () => {
    const { width, height } = canvas

    smooth.x += (mouse.x - smooth.x) * 0.13
    smooth.y += (mouse.y - smooth.y) * 0.13

    trail.unshift({ x: smooth.x, y: smooth.y })
    if (trail.length > TRAIL_LENGTH) {
      trail.length = TRAIL_LENGTH
    }

    ctx.clearRect(0, 0, width, height)

    if (bottom.naturalWidth) {
      ctx.drawImage(bottom, 0, 0, width, height)
    }

    if (top.naturalWidth) {
      off.clearRect(0, 0, width, height)
      off.globalCompositeOperation = 'source-over'

      for (let i = 0; i < trail.length; i++) {
        const t = 1 - i / trail.length
        const r = HEAD_RADIUS * (0.25 + 0.75 * t)
        const alpha = Math.pow(t, 1.5)
        off.beginPath()
        off.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2)
        off.fillStyle = `rgba(0,0,0,${alpha})`
        off.fill()
      }

      off.globalCompositeOperation = 'source-in'
      off.drawImage(top, 0, 0, width, height)
      ctx.drawImage(offscreen, 0, 0)

      if (trail.length > 0) {
        const head = trail[0]
        const glow = ctx.createRadialGradient(
          head.x, head.y, 0,
          head.x, head.y, HEAD_RADIUS * 1.4
        )
        glow.addColorStop(0, 'rgba(232, 180, 30, 0.22)')
        glow.addColorStop(0.5, 'rgba(232, 180, 30, 0.10)')
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(head.x, head.y, HEAD_RADIUS * 1.4, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
    }

    requestAnimationFrame(draw)
  }

  bottom.src = 'public/images/twoo.jpg'
  top.src = 'public/images/one.jpg'
  requestAnimationFrame(draw)
})()
