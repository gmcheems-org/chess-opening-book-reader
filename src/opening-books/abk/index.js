//see https://chessprogramming.wikispaces.com/ABK
//http://www.talkchess.com/forum/viewtopic.php?topic_view=threads&p=184321&t=20661
import { key_from_fen } from '../../utils.js'
import EventEmitter from 'events'

const ENTRY_SIZE = 28 //bytes
const START_ADDRESS = ENTRY_SIZE * 900

import ABKEntry from './entry.js'

class ABKParser extends EventEmitter {
  constructor() {
    super()
    this.data = undefined
    this.start = 900 * ENTRY_SIZE
    this.entry_num = 0
    this.current_depth = 0
    this.current_address = 900
    this.read_to_start = false
    this.received_bytes = 0
    this.can_read = true
    this.current_path = []
  }

  parse(buffer) {
    this.received_bytes += buffer.length
    if (this.received_bytes > this.start + ENTRY_SIZE) {
      this.read_to_start = true
    }

    if (this.read_to_start) {
      while (this.can_read) {
        this.read_record(buffer)
      }
    }

    this.emit('finish')
  }

  read_record(buffer) {
    let offset = ENTRY_SIZE * this.entry_num
    let record = buffer.slice(
      START_ADDRESS + offset,
      START_ADDRESS + ENTRY_SIZE + offset,
    )
    let entry = ABKEntry.fromBuffer(record, this.entry_num + 900)
    if (this.current_path.length > 0) {
      this.current_path[this.current_path.length - 1].children.push(entry)
      for (let p of this.current_path) {
        entry.path.push(p)
      }
      if (entry.first_child > -1) {
        this.current_path.push(entry)
      } else if (entry.first_child === -1 && entry.next_sibling === -1) {
        let remove = 0
        for (let p of this.current_path) {
          if (p.next_sibling === -1) {
            remove++
          }
        }
        this.current_path = this.current_path.slice(
          0,
          this.current_path.length - remove,
        )
      }
    } else {
      this.current_path = [entry]
    }
    this.entry_num++
    entry.entry_num = this.entry_num
    this.emit('data', entry)
    this.can_read =
      buffer.length > START_ADDRESS + ENTRY_SIZE + offset + ENTRY_SIZE
  }
}

class ABK extends EventEmitter {
  constructor() {
    super()
    this.loaded = false
    this.entries = {}
  }

  load_book(buffer) {
    const parser = new ABKParser()
    parser.on('data', (entry) => {
      let key = key_from_fen(entry.fen)
      console.log('abc fen', entry.fen)
      if (this.entries[key]) {
        this.entries[key].push(entry)
      } else {
        this.entries[key] = [entry]
      }
    })
    parser.on('finish', () => {
      this.loaded = true
      this.emit('loaded')
    })
    parser.parse(buffer)
  }

  find(fen) {
    let key = key_from_fen(fen)
    return this.entries[key]
  }
}

export default ABK
