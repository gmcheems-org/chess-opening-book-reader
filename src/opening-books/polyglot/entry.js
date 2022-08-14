import { encode_move, decode_move } from './encoding.js'

import pkg from 'int64-buffer'
import { fen_hash } from './tools.js'
const { Uint64BE } = pkg

class PolyglotEntry {
  static fromBuffer(buffer) {
    let dataView = new DataView(buffer)
    let entry = new PolyglotEntry()
    entry._key = new Uint64BE(buffer.slice(0, 8)).toString(16)
    if (entry._key.length < 16) {
      let pad = 16 - entry._key.length
      for (let x = 0; x < pad; x++) {
        entry._key = '0' + entry._key
      }
    }
    entry._encoded_move = dataView.getUint16(8, false)
    entry._algebraic_move = decode_move(dataView.getUint16(8, false))
    entry._weight = dataView.getUint16(10, false)
    entry._learn = dataView.getUint32(12, false)
    return entry
  }

  static withFEN(fen, algebraic_move, weight, learn) {
    let entry = new PolyglotEntry()
    entry._key = fen_hash(fen)
    entry.algebraic_move = algebraic_move
    entry.weight = weight
    entry.learn = learn
  }

  constructor() {}

  get key() {
    return this._key
  }
  get algebraic_move() {
    return this._algebraic_move
  }
  get encoded_move() {
    return this._encoded_move
  }
  set algebraic_move(move) {
    this._algebraic_move = move
    this._encoded_move = encode_move(move)
  }
  get weight() {
    return this._weight
  }
  set weight(weight) {
    this._weight = weight
  }
  get learn() {
    return this._learn
  }
  set learn(learn) {
    this._learn = learn
  }
  toJSON() {
    return {
      key: this._key,
      aglebraic_move: this._aglebraic_move,
      encoded_move: this._encoded_move,
      weight: this._weight,
      learn: this._learn,
    }
  }
  toString() {
    return JSON.stringify(this, undefined, ' ')
  }
}
export default PolyglotEntry
