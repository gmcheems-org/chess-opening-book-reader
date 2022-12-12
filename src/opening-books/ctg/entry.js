import { Chess } from 'chess.js'

import {
  castle_encoding,
  en_passant_encoding,
  en_passant_encoding_black,
} from './encoding.js'
import { key_from_fen } from '../../utils.js'
import { BaseEntry } from '../base.js'

class CTGEntry extends BaseEntry {
  constructor(to_move) {
    super()
    this.to_move = to_move || 'w'
    this.book_moves = []
    this.ratings = []
    this.total_games = 0
    this.white_wins = 0
    this.black_wins = 0
    this.draws = 0
    this.unknown1
    this.unknown2
    this.is_mirrored = false
  }

  setFen(fen) {
    if (this.has_castling) {
      let castle_string = ''
      for (let encoding of castle_encoding) {
        if (this.castling_data & encoding.code) {
          castle_string += encoding.value
        }
      }
      fen = fen.replace('-', castle_string)
    }
    if (this.has_en_passant) {
      let ep_coding =
        this.to_move === 'w' ? en_passant_encoding : en_passant_encoding_black
      for (let coding of ep_coding) {
        if (coding.code & this.en_passant_data) {
          let fen_items = fen.split(' ')
          fen_items[3] = coding.value
          fen = fen_items.join(' ')
        }
      }
    }
    if (this.to_move === 'b') {
      let fen_items = fen.split(' ')
      fen_items[1] = 'b'
      fen = fen_items.join(' ')
    }
    this._fen = fen
    this.key = key_from_fen(fen)
  }

  get type() {
    return 'ctg'
  }

  get fen() {
    return this._fen
  }

  toPGN() {
    throw new Error('PGN not available')
  }

  toChess() {
    let chess = new Chess(this.fen)
    return chess
  }

  toString() {
    return JSON.stringify(this, undefined, '')
  }
}
export default CTGEntry
