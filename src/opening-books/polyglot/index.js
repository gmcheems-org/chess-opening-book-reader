import EventEmitter from 'events'

import PolyglotEntry from './entry.js'
import { fen_hash } from './tools.js'

class PolyglotParser extends EventEmitter {
  constructor() {
    super()
    this.data = undefined
  }

  parse(buffer) {
    for (let index = 16; index < buffer.byteLength; index = index + 16) {
      let b = buffer.slice(index - 16, index)
      let entry = PolyglotEntry.fromBuffer(b)
      this.emit('data', entry)
    }
    this.emit('finish')
  }
}

export default class Polyglot extends EventEmitter {
  constructor() {
    super()
    this.loaded = false
    this.entries = []
  }

  load_book(buffer) {
    const parser = new PolyglotParser()
    parser.on('data', (entry) => {
      if (!this.entries[entry.key]) {
        this.entries[entry.key] = []
      }
      this.entries[entry.key].push(entry)
    })
    parser.on('finish', () => {
      this.loaded = true
      this.emit('loaded')
    })
    parser.parse(buffer)
  }

  find(fen) {
    if (!this.loaded) {
      throw new Error('No book is loaded')
    }
    let hash = this.generate_hash(fen)
    return this.entries[hash]
  }

  generate_hash(fen) {
    /**From the polyglot module **/
    return fen_hash(fen)
  }
}
