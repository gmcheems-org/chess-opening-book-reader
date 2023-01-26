import EventEmitter from 'events'
import PolyglotEntry from './entry.js'

export class PolyglotParser extends EventEmitter {
  stopProcessing = false
  waitTime = 100
  batchSize = 1000

  constructor() {
    super()
    this.on('stop', () => {
      this.stopProcessing = true
    })
    this.on('updateWaitTime', (newWait) => {
      this.waitTime = newWait
    })
    this.on('updateBatchSize', (newBatch) => {
      this.batchSize = newBatch
    })
  }

  async parse({ buffer, wait = true }) {
    let batchEntries = []

    for (let index = 16; index < buffer.byteLength; index = index + 16) {
      if (this.stopProcessing) {
        break
      }

      let b = buffer.slice(index - 16, index)
      const entry = PolyglotEntry.fromBuffer(b)
      if (!entry) {
        continue
      }
      batchEntries.push(entry)

      if (batchEntries.length >= this.batchSize) {
        this.emit('batch', batchEntries)
        this.emit('progress', index / buffer.byteLength)
        batchEntries = []
        if (wait) {
          await new Promise((r) => setTimeout(r, this.waitTime))
        }
      }
    }

    if (batchEntries.length > 0) {
      this.emit('batch', batchEntries)
    }
  }
}
