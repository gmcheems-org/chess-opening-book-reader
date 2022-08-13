import { Chess } from 'chess.js'
const chess = new Chess()

export const peice_encoding = {
  0: { txt: ' ', type: null, color: null },
  110: { txt: 'P', type: chess.PAWN, color: chess.WHITE },
  10110: { txt: 'R', type: chess.ROOK, color: chess.WHITE },
  10100: { txt: 'B', type: chess.BISHOP, color: chess.WHITE },
  10010: { txt: 'N', type: chess.KNIGHT, color: chess.WHITE },
  100010: { txt: 'Q', type: chess.QUEEN, color: chess.WHITE },
  100000: { txt: 'K', type: chess.KING, color: chess.WHITE },
  111: { txt: 'p', type: chess.PAWN, color: chess.BLACK },
  10111: { txt: 'r', type: chess.ROOK, color: chess.BLACK },
  10101: { txt: 'b', type: chess.BISHOP, color: chess.BLACK },
  10011: { txt: 'n', type: chess.KNIGHT, color: chess.BLACK },
  100011: { txt: 'q', type: chess.QUEEN, color: chess.BLACK },
  100001: { txt: 'k', type: chess.KING, color: chess.BLACK },
}

export const peice_encoding_black = {
  0: { txt: ' ', type: null, color: null },
  110: { txt: 'p', type: chess.PAWN, color: chess.BLACK },
  10110: { txt: 'r', type: chess.ROOK, color: chess.BLACK },
  10100: { txt: 'b', type: chess.BISHOP, color: chess.BLACK },
  10010: { txt: 'n', type: chess.KNIGHT, color: chess.BLACK },
  100010: { txt: 'q', type: chess.QUEEN, color: chess.BLACK },
  100000: { txt: 'k', type: chess.KING, color: chess.BLACK },
  111: { txt: 'P', type: chess.PAWN, color: chess.WHITE },
  10111: { txt: 'R', type: chess.ROOK, color: chess.WHITE },
  10101: { txt: 'B', type: chess.BISHOP, color: chess.WHITE },
  10011: { txt: 'N', type: chess.KNIGHT, color: chess.WHITE },
  100011: { txt: 'Q', type: chess.QUEEN, color: chess.WHITE },
  100001: { txt: 'K', type: chess.KING, color: chess.WHITE },
}

export const flip_ep_column = [0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x00]

export const castle_encoding = [
  { code: 0x02, value: 'K' },
  { code: 0x01, value: 'Q' },
  { code: 0x8, value: 'k' },
  { code: 0x04, value: 'q' },
]

export const en_passant_encoding = [
  { code: 0x00, value: 'a6' },
  { code: 0x01, value: 'b6' },
  { code: 0x02, value: 'c6' },
  { code: 0x03, value: 'd6' },
  { code: 0x04, value: 'e6' },
  { code: 0x05, value: 'f6' },
  { code: 0x06, value: 'g6' },
  { code: 0x07, value: 'h6' },
]

export const en_passant_encoding_black = [
  { code: 0x00, value: 'a4' },
  { code: 0x01, value: 'b4' },
  { code: 0x02, value: 'c4' },
  { code: 0x03, value: 'd4' },
  { code: 0x04, value: 'e4' },
  { code: 0x05, value: 'f4' },
  { code: 0x06, value: 'g4' },
  { code: 0x07, value: 'h4' },
]

export const ep_mask = parseInt('11100000', 2)
export const castle_mask = parseInt('00011110', 2)
export const po = 0x1f
export const ep = 0x20
export const ca = 0x40
