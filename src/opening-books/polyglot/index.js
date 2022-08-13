import int64Buffer from 'int64-buffer'

import EventEmitter from 'events'
import { Chess } from 'chess.js'
import { Transform } from 'node:stream'
import utils from '../../utils.js'

const files = utils.board.FILES
const { Uint64BE } = int64Buffer

import {
  RandomPiece,
  RandomCastle,
  RandomEnPassant,
  RandomTurn,
  pieceTypes,
} from './encoding.js'

import PolyglotEntry from './entry.js'
class PolyglotStream extends Transform {
  constructor() {
    super({ readableObjectMode: true })
  }
  // _flush(callback) {
  //   console.log("flush");
  //   callback();
  // }
  _transform(chunk, encoding, callback) {
    this._data = this._data ? Buffer.concat(this._data, chunk) : chunk
    // let entries = [];
    if (this._data.length >= 16) {
      let index = 16
      let remainder = this._data.length % 16
      let extra_data
      if (remainder > 0) {
        //take the last bit of the buffer and save it.
        extra_data = Buffer.from(
          this._data.buffer.slice(
            this._data.length - remainder,
            this._data.length,
          ),
        )
      }
      for (index = 16; index < this._data.length; index = index + 16) {
        let b = this._data.buffer.slice(index - 16, index)
        let entry = PolyglotEntry.fromBuffer(b)
        this.push(entry)
      }
      this._data = extra_data
    }
    //this.push(entries);
    callback()
  }
}
class Polyglot extends EventEmitter {
  constructor() {
    super()
    this.loaded = false
    this.entries = []
    this.stream = new PolyglotStream()
  }
  load_book(stream) {
    this.entries = []
    this.loaded = false

    this.stream.on('data', (entry) => {
      if (!this.entries[entry.key]) {
        this.entries[entry.key] = []
      }
      this.entries[entry.key].push(entry)
    })
    this.stream.on('finish', () => {
      this.loaded = true
      this.emit('loaded')
    })
    this.stream.on('error', (error) => {
      console.log('error', error)
      this.emit('error', error)
    })
    stream.pipe(this.stream)
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
    return hash(fen)
  }
}
function xor_64uint(a, b) {
  let output
  let a_view = new DataView(a.toArrayBuffer())
  let b_view = new DataView(b.toArrayBuffer())
  let a_32_hi = a_view.getUint32(0, false)
  let a_32_lo = a_view.getUint32(4, false)
  let b_32_hi = b_view.getUint32(0, false)
  let b_32_lo = b_view.getUint32(4, false)
  let n_hi = a_32_hi ^ b_32_hi
  let n_lo = a_32_lo ^ b_32_lo
  return Uint64BE(n_hi, n_lo)
}

function hash(fen) {
  let game = new Chess(fen)
  let result = game.validate_fen(fen)
  if (!result.valid) {
    throw result.error
  }
  //Calculate piece offsets
  let pieceOffsets = []
  for (let file = 0; file < 8; file++) {
    for (let rank = 1; rank <= 8; rank++) {
      let piece = game.get(files[file] + rank)
      if (piece) {
        pieceOffsets.push(
          64 * pieceTypes[piece.color + piece.type] + 8 * (rank - 1) + file,
        )
      }
    }
  }
  //Calculate castling offsets
  let castlingOffsets = []
  let fenTokens = game.fen().split(' ')
  let castlingField = fenTokens[2]
  if (castlingField.includes('K')) {
    castlingOffsets.push(0)
  }
  if (castlingField.includes('Q')) {
    castlingOffsets.push(1)
  }
  if (castlingField.includes('k')) {
    castlingOffsets.push(2)
  }
  if (castlingField.includes('q')) {
    castlingOffsets.push(3)
  }
  //Calculate enpassant offsets
  let epOffset = -1
  let fenEpSquare = fenTokens[3]
  if (fenEpSquare !== '-') {
    fenEpSquare = fenEpSquare[0] + (game.turn() === 'w' ? '5' : '4')
    let epSquareIndex = files.indexOf(fenEpSquare[0])
    if (epSquareIndex > 0) {
      let leftPiece = game.get(files[epSquareIndex - 1] + fenEpSquare[1])
      if (
        leftPiece &&
        leftPiece.type === 'p' &&
        leftPiece.color === game.turn()
      ) {
        epOffset = epSquareIndex
      }
    }
    if (epSquareIndex < 7) {
      let rightPiece = game.get(files[epSquareIndex + 1] + fenEpSquare[1])
      if (
        rightPiece &&
        rightPiece.type === 'p' &&
        rightPiece.color === game.turn()
      ) {
        epOffset = epSquareIndex
      }
    }
  }
  let isWhitesTurn = game.turn() === 'w'
  let fen_hash = Uint64BE(0)
  for (let offset of pieceOffsets) {
    fen_hash = xor_64uint(fen_hash, RandomPiece[offset])
  }
  for (let offset of castlingOffsets) {
    fen_hash = xor_64uint(fen_hash, RandomCastle[offset])
  }
  if (epOffset >= 0) {
    fen_hash = xor_64uint(fen_hash, RandomEnPassant[epOffset])
  }
  if (isWhitesTurn) {
    fen_hash = xor_64uint(fen_hash, RandomTurn[0])
  }
  let output = fen_hash.toString(16)
  if (output.length < 16) {
    let pad = 16 - output.length
    for (let x = 0; x < pad; x++) {
      output = '0' + output
    }
  }
  return output
}
Polyglot.PolyglotStream = PolyglotStream
Polyglot.PolyglotEntry = PolyglotEntry
export default Polyglot
