import { currency, store } from '../data/store'

/**
 * Draws the order receipt onto a canvas and hands back a PNG.
 *
 * Done with the plain Canvas 2D API on purpose -- no html2canvas, no extra
 * dependency, and the output is a crisp 2x image that looks the same on every
 * machine instead of depending on whatever the browser painted on screen.
 */

const WIDTH = 620 // CSS px; the bitmap is this x SCALE
const SCALE = 2
const PAD = 40
const LINE = 26

//  Segoe UI / Arial are in the stack because they carry the peso sign; canvas
//  falls back glyph by glyph if Nunito has not loaded or lacks it.
const SANS = "'Nunito', 'Segoe UI', Arial, sans-serif"
const MONO = "'Consolas', 'SF Mono', 'Menlo', monospace"

const INK = '#1c1917'
const SOFT = '#57534e'
const RULE = '#d6d3d1'

/** Turns "2026-08-27T17:12" into a short, human receipt number. */
export function makeReceiptRef(date = new Date()) {
  const stamp = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
  const suffix = String(Math.floor(Math.random() * 9000) + 1000)
  return `GVG-${stamp}-${suffix}`
}

export function formatReceiptDate(date) {
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/** Greedy word wrap against the live canvas metrics. */
function wrap(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  const lines = []
  let current = words[0]

  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate
    } else {
      lines.push(current)
      current = words[i]
    }
  }
  lines.push(current)
  return lines
}

/**
 * @param {object} order  { ref, date, customer, items, subtotal, deliveryFee, total }
 * @returns {Promise<{ blob: Blob, dataUrl: string, fileName: string }>}
 */
export async function renderReceipt(order) {
  //  Wait for the webfont so the image matches the page. Never block on it.
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      /* fall back to the system stack */
    }
  }

  const measure = document.createElement('canvas').getContext('2d')
  const inner = WIDTH - PAD * 2

  // ---- Layout pass: work out how tall the receipt needs to be -------------
  measure.font = `14px ${SANS}`
  const addressLines =
    order.customer.service === 'Delivery' && order.customer.address
      ? wrap(measure, order.customer.address, inner - 110)
      : []
  const noteLines = order.customer.note ? wrap(measure, order.customer.note, inner) : []

  measure.font = `14px ${MONO}`
  const itemBlocks = order.items.map((item) => ({
    item,
    lines: wrap(measure, `${item.quantity}x ${item.name}`, inner - 90),
  }))
  const itemLineCount = itemBlocks.reduce((sum, block) => sum + block.lines.length, 0)

  const height =
    PAD + // top padding
    96 + // store name + tagline
    (store.mobile ? LINE : 0) +
    (store.address ? LINE : 0) +
    28 + // rule
    LINE * (4 + addressLines.length) + // meta rows
    28 + // rule
    LINE + // column header
    LINE * itemLineCount +
    28 + // rule
    LINE * (order.deliveryFee > 0 ? 3 : 2) + // subtotal (+fee) + total
    (noteLines.length ? 28 + LINE * (noteLines.length + 1) : 0) +
    36 + // rule
    LINE * 3 + // closing note
    PAD

  // ---- Draw pass ---------------------------------------------------------
  //  The estimate above only has to be generous, not exact -- the canvas is
  //  allocated with slack and then cropped to wherever the ink actually ends,
  //  so the receipt never gains a band of dead white space at the bottom.
  const allocated = Math.ceil(height) + 120

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH * SCALE
  canvas.height = allocated * SCALE
  const ctx = canvas.getContext('2d')
  ctx.scale(SCALE, SCALE)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, WIDTH, allocated)

  let y = PAD

  const centre = (text, font, color = INK) => {
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(text, WIDTH / 2, y)
    ctx.textAlign = 'left'
  }

  const rule = () => {
    y += 10
    ctx.strokeStyle = RULE
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(PAD, y + 0.5)
    ctx.lineTo(WIDTH - PAD, y + 0.5)
    ctx.stroke()
    ctx.setLineDash([])
    y += 18
  }

  //  Row with a left label and a right-aligned value.
  const row = (label, value, { font = `14px ${SANS}`, color = INK, bold = false } = {}) => {
    ctx.font = bold ? `bold ${font}` : font
    ctx.fillStyle = color
    ctx.fillText(label, PAD, y)
    ctx.textAlign = 'right'
    ctx.fillText(value, WIDTH - PAD, y)
    ctx.textAlign = 'left'
    y += LINE
  }

  // Header
  y += 14
  centre(store.name.toUpperCase(), `bold 26px ${SANS}`)
  y += 26
  centre(store.tagline, `14px ${SANS}`, SOFT)
  y += LINE
  if (store.mobile) {
    centre(store.mobile, `14px ${SANS}`, SOFT)
    y += LINE
  }
  if (store.address) {
    centre(store.address, `13px ${SANS}`, SOFT)
    y += LINE
  }

  rule()

  // Meta
  row('Receipt No.', order.ref, { font: `13px ${MONO}`, color: SOFT })
  row('Date', formatReceiptDate(order.date), { font: `13px ${SANS}`, color: SOFT })
  row('Customer', order.customer.name, { font: `13px ${SANS}`, color: SOFT })
  row('Type', order.customer.service, { font: `13px ${SANS}`, color: SOFT })

  if (addressLines.length) {
    ctx.font = `13px ${SANS}`
    ctx.fillStyle = SOFT
    ctx.fillText('Address', PAD, y)
    ctx.textAlign = 'right'
    addressLines.forEach((line, index) => {
      ctx.fillText(line, WIDTH - PAD, y + index * LINE)
    })
    ctx.textAlign = 'left'
    y += LINE * addressLines.length
  }

  rule()

  // Items
  ctx.font = `bold 12px ${SANS}`
  ctx.fillStyle = SOFT
  ctx.fillText('ITEM', PAD, y)
  ctx.textAlign = 'right'
  ctx.fillText('AMOUNT', WIDTH - PAD, y)
  ctx.textAlign = 'left'
  y += LINE

  itemBlocks.forEach(({ item, lines }) => {
    ctx.font = `14px ${MONO}`
    ctx.fillStyle = INK
    lines.forEach((line, index) => {
      ctx.fillText(line, PAD, y + index * LINE)
    })
    ctx.textAlign = 'right'
    ctx.fillText(currency.format(item.subtotal), WIDTH - PAD, y)
    ctx.textAlign = 'left'
    y += LINE * lines.length
  })

  rule()

  // Totals
  row('Subtotal', currency.format(order.subtotal), { color: SOFT })
  if (order.deliveryFee > 0) {
    row('Delivery fee', currency.format(order.deliveryFee), { color: SOFT })
  }
  row('TOTAL', currency.format(order.total), { font: `18px ${SANS}`, bold: true })

  // Note
  if (noteLines.length) {
    rule()
    ctx.font = `bold 12px ${SANS}`
    ctx.fillStyle = SOFT
    ctx.fillText('NOTE', PAD, y)
    y += LINE
    ctx.font = `14px ${SANS}`
    ctx.fillStyle = INK
    noteLines.forEach((line) => {
      ctx.fillText(line, PAD, y)
      y += LINE
    })
  }

  rule()

  // Closing
  centre('Hindi pa kumpirmado ang order hangga’t', `13px ${SANS}`, SOFT)
  y += LINE
  centre('hindi kami nakakasagot sa message mo.', `13px ${SANS}`, SOFT)
  y += LINE + 4
  centre('Salamat po!', `bold 15px ${SANS}`, INK)

  // ---- Crop to content ---------------------------------------------------
  //  `y` is the baseline of the last line; leave room for descenders, then
  //  the same padding used at the top so the receipt is visually balanced.
  const finalHeight = Math.ceil(y + 10 + PAD)

  const output = document.createElement('canvas')
  output.width = WIDTH * SCALE
  output.height = finalHeight * SCALE
  //  Straight 1:1 bitmap copy -- both canvases are already at SCALE.
  output.getContext('2d').drawImage(canvas, 0, 0)

  // ---- Export ------------------------------------------------------------
  const blob = await new Promise((resolve) => output.toBlob(resolve, 'image/png'))
  return {
    blob,
    dataUrl: output.toDataURL('image/png'),
    fileName: `${order.ref}.png`,
  }
}

/** Saves the PNG to the customer's device. */
export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  //  Give the browser a beat to start the download before dropping the URL.
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
