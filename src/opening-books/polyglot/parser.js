import EventEmitter from 'events'
import PolyglotEntry from './entry.js'

export class PolyglotParser extends EventEmitter {
  async parse({ buffer, wait = true }) {
    let batchEntries = []

    let batchSize = 1000,
      waitTime = 100

    for (let index = 16; index < buffer.byteLength; index = index + 16) {
      let b = buffer.slice(index - 16, index)
      const entry = PolyglotEntry.fromBuffer(b)
      if (!entry) {
        continue
      }
      batchEntries.push(entry)

      if (batchEntries.length >= batchSize) {
        this.emit('batch', batchEntries)
        this.emit('progress', index / buffer.byteLength)
        batchEntries = []
        if (wait) {
          await new Promise((r) => setTimeout(r, waitTime))
        }
      }
    }

    this.emit('batch', batchEntries)
  }
}

export { polyglot_fen_hash } from './tools.js'
