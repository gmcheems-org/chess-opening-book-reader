const FEN_ITEMS = ['ranks', 'to_move', 'castling', 'en_pass']

/*
  FEN is <RANK>/(x8)<SPACE><TO_MOVE><SPACE><CASTLING><SPACE><ENPASS><SPACE><HALFMOVE_CLOCK><SPACE><MOVE_NUMBER>(with each rank A-H with a peice. or skips.)
*/
export const key_from_fen = function (fen) {
  return fen.split(' ').slice(0, 4).join(' ') //strip move number and halfmove from it.
}

export const flip_board = function (fen) {
  let data = {}
  fen
    .split(' ')
    .slice(0, 4)
    .map((value, index) => {
      data[FEN_ITEMS[index]] = value
    })
  data.to_move = data.to_move === 'w' ? 'b' : 'w'
  let ranks = []
  let x = 7
  for (let rank of data.ranks.split('/')) {
    let row = ''
    for (let item of rank.split('')) {
      row = board.MIRROR_PEICE[item]
        ? row + board.MIRROR_PEICE[item]
        : row + String(item)
    }
    ranks[x] = row
    x--
  }
  data.ranks = ranks.join('/')
  let en_pass = '-'
  if (data.en_pass !== '-') {
    en_pass = data.en_pass.includes('3')
      ? data.en_pass.replace('3', '6')
      : data.en_pass.replace('6', '3')
  }
  data.en_pass = en_pass
  let castling = '-'
  if (data.castling !== '-') {
    castling = board.MIRROR_CASTLING[data.castling]
  }
  data.castling = castling
  return (
    data.ranks + ' ' + data.to_move + ' ' + data.castling + ' ' + data.en_pass
  )
}

export const pad_number_string = function (string_, expected_length) {
  if (string_.length < expected_length) {
    let pad = expected_length - string_.length
    for (let x = 0; x < pad; x++) {
      string_ = '0' + string_
    }
  }
  return string_
}

export const debug_buffer_to_string = function (buffer) {
  let array = new Uint8Array(buffer)
  console.log('\nSTART_BUFFER_DUMP\n')
  for (const [index, element] of array.entries()) {
    if (index % 32 == 0) {
      console.log('\n')
    }
    console.log(to_hex_string(element) + ' ')
  }
  console.log('\nEND_BUFFER_DUMP\n')
}

function to_hex_string(number) {
  return '0x' + pad_number_string(number.toString(16), 2)
}

export const board = {}
board.FILES = [...'abcdefgh']
board.RANKS = [...'12345678']
board.BOARD_INDEX = {
  a1: 0,
  a2: 1,
  a3: 2,
  a4: 3,
  a5: 4,
  a6: 5,
  a7: 6,
  a8: 7,
  b1: 8,
  b2: 9,
  b3: 10,
  b4: 11,
  b5: 12,
  b6: 13,
  b7: 14,
  b8: 15,
  c1: 16,
  c2: 17,
  c3: 18,
  c4: 19,
  c5: 20,
  c6: 21,
  c7: 22,
  c8: 23,
  d1: 24,
  d2: 25,
  d3: 26,
  d4: 27,
  d5: 28,
  d6: 29,
  d7: 30,
  d8: 31,
  e1: 32,
  e2: 33,
  e3: 34,
  e4: 35,
  e5: 36,
  e6: 37,
  e7: 38,
  e8: 39,
  f1: 40,
  f2: 41,
  f3: 42,
  f4: 43,
  f5: 44,
  f6: 45,
  f7: 46,
  f8: 47,
  g1: 48,
  g2: 49,
  g3: 50,
  g4: 51,
  g5: 52,
  g6: 53,
  g7: 54,
  g8: 55,
  h1: 56,
  h2: 57,
  h3: 58,
  h4: 59,
  h5: 60,
  h6: 61,
  h7: 62,
  h8: 63,
}

board.FLIP_BOARD = {
  a1: 'a8',
  a2: 'a7',
  a3: 'a6',
  a4: 'a5',
  a5: 'a4',
  a6: 'a3',
  a7: 'a2',
  a8: 'a1',
  b1: 'b8',
  b2: 'b7',
  b3: 'b6',
  b4: 'b5',
  b5: 'b4',
  b6: 'b3',
  b7: 'b2',
  b8: 'b1',
  c1: 'c8',
  c2: 'c7',
  c3: 'c6',
  c4: 'c5',
  c5: 'c4',
  c6: 'c3',
  c7: 'c2',
  c8: 'c1',
  d1: 'd8',
  d2: 'd7',
  d3: 'd6',
  d4: 'd5',
  d5: 'd4',
  d6: 'd3',
  d7: 'd2',
  d8: 'd1',
  e1: 'e8',
  e2: 'e7',
  e3: 'e6',
  e4: 'e5',
  e5: 'e4',
  e6: 'e3',
  e7: 'e2',
  e8: 'e1',
  f1: 'f8',
  f2: 'f7',
  f3: 'f6',
  f4: 'f5',
  f5: 'f4',
  f6: 'f3',
  f7: 'f2',
  f8: 'f1',
  g1: 'g8',
  g2: 'g7',
  g3: 'g6',
  g4: 'g5',
  g5: 'g4',
  g6: 'g3',
  g7: 'g2',
  g8: 'g1',
  h1: 'h8',
  h2: 'h7',
  h3: 'h6',
  h4: 'h5',
  h5: 'h4',
  h6: 'h3',
  h7: 'h2',
  h8: 'h1',
}
board.MIRROR_FILE = {
  a: 'h',
  b: 'g',
  c: 'f',
  d: 'e',
  e: 'd',
  f: 'c',
  g: 'b',
  h: 'a',
}
board.MIRROR_PEICE = {
  P: 'p',
  N: 'n',
  B: 'b',
  R: 'r',
  Q: 'q',
  K: 'k',
  p: 'P',
  n: 'N',
  b: 'B',
  r: 'R',
  q: 'Q',
  k: 'K',
}
board.MIRROR_CASTLING = {
  K: 'k',
  KQ: 'kq',
  KQk: 'Kkq',
  KQkq: 'KQkq',
  Q: 'q',
  Qq: 'Qq',
  Qk: 'Kq',
  Qkq: 'KQq',
  k: 'K',
  kq: 'KQ',
  q: 'Q',
}

export default {
  board: board,
}
