import EventEmitter from 'events'
import EPDEntry from './entry.js'
import { key_from_fen } from '../../utils.js'

class EPDParser extends EventEmitter {
  parse(buffer) {
    let data = new TextDecoder().decode(buffer)
    let lines = data.split(/\n/m)
    this.processLines(lines)
    this.emit('finish')
  }
  processLines(lines) {
    let length = lines.length
    for (let index = 0; index < length; index++) {
      let line = lines.shift()
      if (line) {
        let entry = EPDEntry.fromLine(line)
        this.emit('data', entry)
      }
    }
  }
}

export default class EPD extends EventEmitter {
  constructor() {
    super()
    this.loaded = false
    this.entries = []
  }

  load_book(buffer) {
    const parser = new EPDParser()
    parser.on('finish', () => {
      this.loaded = true
      this.emit('loaded')
    })
    parser.on('data', (entry) => {
      this.entries.push(entry)
    })
    parser.parse(buffer)
  }

  find(fen) {
    if (!this.loaded) {
      throw new Error('EPD not loaded')
    }
    let match_key = key_from_fen(fen)
    let entries = []
    for (let entry of this.entries) {
      if (key_from_fen(entry.fen) == match_key) {
        entries.push(entry)
      }
    }
    return entries
  }
}
