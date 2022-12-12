import utils from '../../utils.js'
let pieces = {
  Pawn: 'P',
  Knight: 'N',
  King: 'K',
  Queen: 'Q',
  Bishop: 'B',
}
let files = utils.board.FILES
function algebraic_position_to_xy(algebraic) {
  let file_and_rank = algebraic.split('')
  let x
  for (x = 0; x < 8; x++) {
    if (files[x] === file_and_rank[0]) {
      break
    }
  }
  return {
    x: Number.parseInt(x),
    y: Number.parseInt(file_and_rank[1]) - 1,
  }
}
function xy_to_algebraic_notation(xy) {
  let rank = xy.y + 1
  let file = files[xy.x]
  return file + '' + rank
}

class CTGMoveService {
  constructor() {}
  decode_move(code, analysis_code, board, is_black, is_mirrored) {
    let move
    let start_position = ''
    let move_notation = ''
    for (move of CTGMoveService.moves) {
      if (Number(code) === Number(move.code)) {
        break
      }
    }
    if (move.move === 'O-O' || move.move === 'O-O-O') {
      move_notation = move.move
    } else {
      let piece_number = move.piece.match(/([A-Za-z]+) (\d)/)
      if (piece_number) {
        let piece_short = pieces[piece_number[1]]
        let piece_number_ = piece_number[2]
        let pn = 1
        let index = 0
        for (let position of board) {
          if (!position || !position.piece) {
            console.log(
              'BOARD ERROR',
              is_black,
              is_mirrored,
              index,
              board.length,
            )
            console.log(JSON.stringify(board, undefined, ' '))
            throw new Error('Board error')
          }
          if (position.piece.txt === piece_short) {
            if (pn == piece_number_) {
              start_position = position.position
              let move_info = move.move.match(/(\w)(\d) ?(\w?)(\d?)/)
              if (move_info) {
                let x_direction = 1
                let y_direction = 1
                let x = 0
                let y = 0
                if (move_info[1] === 'b') {
                  y_direction = is_black ? 1 : -1
                }
                if (move_info[1] === 'r' || move_info[3] === 'r') {
                  x_direction = is_black && !is_mirrored ? 1 : -1
                }
                if (move_info[1] === 'b' || move_info[1] === 'f') {
                  y = move_info[2]
                } else {
                  x = move_info[2]
                }
                if (move_info[3]) {
                  x = move_info[4]
                }
                x = x * x_direction
                y = y * y_direction
                let xy = algebraic_position_to_xy(start_position)
                xy.y = xy.y + y
                xy.x = xy.x + x
                move_notation =
                  start_position + '' + xy_to_algebraic_notation(xy)
              }

              break
            } else {
              pn++
            }
          }
          index++
        }
      }
    }
    return {
      move: move,
      analysis: this.decode_analysis(analysis_code),
      move_notation: move_notation,
    }
  }
  decode_analysis(analysis_code) {
    let analysis
    for (analysis of CTGMoveService.analysis) {
      if (Number(analysis.code) === Number(analysis_code)) {
        break
      }
    }
    return analysis
  }
}

CTGMoveService.analysis = [
  { code: '0x00', description: 'No annotation' },
  { code: '0x01', description: '!' },
  { code: '0x02', description: '?' },
  { code: '0x03', description: '!!' },
  { code: '0x04', description: '??' },
  { code: '0x05', description: '!?' },
  { code: '0x06', description: '?!' },
  { code: '0x08', description: 'Only move' },
  { code: '0x16', description: 'Zugzwang' },
  { code: '0x0b', description: '=' },
  { code: '0x0d', description: 'Unclear' },
  { code: '0x0e', description: '=+' },
  { code: '0x0f', description: '+=' },
  { code: '0x10', description: '-/+' },
  { code: '0x11', description: '+/-' },
  { code: '0x13', description: '+-' },
  { code: '0x20', description: 'Development adv.' },
  { code: '0x24', description: 'Initiative' },
  { code: '0x28', description: 'With attack' },
  { code: '0x2c', description: 'Compensation' },
  { code: '0x84', description: 'Counterplay' },
  { code: '0x8a', description: 'Zeitnot' },
  { code: '0x92', description: 'Novelty' },
]

CTGMoveService.moves = [
  { code: '0x00', piece: 'Pawn 5', move: 'f1 r1' },
  { code: '0x01', piece: 'Knight 2', move: 'b1 l2' },
  { code: '0x03', piece: 'Queen 2', move: 'r2' },
  { code: '0x04', piece: 'Pawn 2', move: 'f1' },
  { code: '0x05', piece: 'Queen 1', move: 'f1' },
  { code: '0x06', piece: 'Pawn 4', move: 'f1 l1' },
  { code: '0x08', piece: 'Queen 2', move: 'r4' },
  { code: '0x09', piece: 'Bishop 2', move: 'f6 r6' },
  { code: '0x0a', piece: 'King ', move: 'b1' },
  { code: '0x0c', piece: 'Pawn 1', move: 'f1 l1' },
  { code: '0x0d', piece: 'Bishop 1', move: 'f3 r3' },
  { code: '0x0e', piece: 'Rook 2', move: 'r3' },
  { code: '0x0f', piece: 'Knight 1', move: 'b1 l2' },
  { code: '0x12', piece: 'Bishop 1', move: 'f7 r7' },
  { code: '0x13', piece: 'King ', move: 'f1' },
  { code: '0x14', piece: 'Pawn 8', move: 'f1 r1' },
  { code: '0x15', piece: 'Bishop 1', move: 'f5 r5' },
  { code: '0x18', piece: 'Pawn 7', move: 'f1' },
  { code: '0x1a', piece: 'Queen 2', move: 'f6' },
  { code: '0x1b', piece: 'Bishop 1', move: 'f1 l1' },
  { code: '0x1d', piece: 'Bishop 2', move: 'f7 r7' },
  { code: '0x21', piece: 'Rook 2', move: 'r7' },
  { code: '0x22', piece: 'Bishop 2', move: 'f2 l2' },
  { code: '0x23', piece: 'Queen 2', move: 'f6 r6' },
  { code: '0x24', piece: 'Pawn 8', move: 'f1 l1' },
  { code: '0x26', piece: 'Bishop 1', move: 'f7 l7' },
  { code: '0x27', piece: 'Pawn 3', move: 'f1 l1' },
  { code: '0x28', piece: 'Queen 1', move: 'f5 r5' },
  { code: '0x29', piece: 'Queen 1', move: 'r6' },
  { code: '0x2a', piece: 'Knight 2', move: 'b2 r1' },
  { code: '0x2d', piece: 'Pawn 6', move: 'f1 r1' },
  { code: '0x2e', piece: 'Bishop 1', move: 'f1 r1' },
  { code: '0x2f', piece: 'Queen 1', move: 'r1' },
  { code: '0x30', piece: 'Knight 2', move: 'b2 l1' },
  { code: '0x31', piece: 'Queen 1', move: 'r3' },
  { code: '0x32', piece: 'Bishop 2', move: 'f5 r5' },
  { code: '0x34', piece: 'Knight 1', move: 'f2 r1' },
  { code: '0x36', piece: 'Knight 1', move: 'f1 r2' },
  { code: '0x37', piece: 'Queen 1', move: 'f4' },
  { code: '0x38', piece: 'Queen 2', move: 'f4 l4' },
  { code: '0x39', piece: 'Queen 1', move: 'r5' },
  { code: '0x3a', piece: 'Bishop 1', move: 'f6 r6' },
  { code: '0x3b', piece: 'Queen 2', move: 'f5 l5' },
  { code: '0x3c', piece: 'Bishop 1', move: 'f5 l5' },
  { code: '0x41', piece: 'Queen 2', move: 'f5 r5' },
  { code: '0x42', piece: 'Queen 1', move: 'f7 l7' },
  { code: '0x44', piece: 'King ', move: 'b1 r1' },
  { code: '0x45', piece: 'Queen 1', move: 'f3 r3' },
  { code: '0x4a', piece: 'Pawn 8', move: 'f2' },
  { code: '0x4b', piece: 'Queen 1', move: 'f5 l5' },
  { code: '0x4c', piece: 'Knight 2', move: 'f2 r1' },
  { code: '0x4d', piece: 'Queen 2', move: 'f1' },
  { code: '0x50', piece: 'Rook 1', move: 'f6' },
  { code: '0x52', piece: 'Rook 1', move: 'r6' },
  { code: '0x54', piece: 'Bishop 2', move: 'f1 l1' },
  { code: '0x55', piece: 'Pawn 3', move: 'f1' },
  { code: '0x5c', piece: 'Pawn 7', move: 'f1 r1' },
  { code: '0x5f', piece: 'Pawn 5', move: 'f2' },
  { code: '0x61', piece: 'Queen 1', move: 'f6 r6' },
  { code: '0x62', piece: 'Pawn 2', move: 'f2' },
  { code: '0x63', piece: 'Queen 2', move: 'f7 l7' },
  { code: '0x66', piece: 'Bishop 1', move: 'f3 l3' },
  { code: '0x67', piece: 'King ', move: 'f1 r1' },
  { code: '0x69', piece: 'Rook 2', move: 'f7' },
  { code: '0x6a', piece: 'Bishop 1', move: 'f4 r4' },
  { code: '0x6b', piece: 'Short Castle', move: 'O-O' },
  { code: '0x6e', piece: 'Rook 1', move: 'r5' },
  { code: '0x6f', piece: 'Queen 2', move: 'f7 r7' },
  { code: '0x72', piece: 'Bishop 2', move: 'f7 l7' },
  { code: '0x74', piece: 'Queen 1', move: 'r2' },
  { code: '0x79', piece: 'Bishop 2', move: 'f6 l6' },
  { code: '0x7a', piece: 'Rook 1', move: 'f3' },
  { code: '0x7b', piece: 'Rook 2', move: 'f6' },
  { code: '0x7c', piece: 'Pawn 3', move: 'f1 r1' },
  { code: '0x7d', piece: 'Rook 2', move: 'f1' },
  { code: '0x7e', piece: 'Queen 1', move: 'f3 l3' },
  { code: '0x7f', piece: 'Rook 1', move: 'r1' },
  { code: '0x80', piece: 'Queen 1', move: 'f6 l6' },
  { code: '0x81', piece: 'Rook 1', move: 'f1' },
  { code: '0x82', piece: 'Pawn 6', move: 'f1 l1' },
  { code: '0x85', piece: 'Knight 1', move: 'f2 l1' },
  { code: '0x86', piece: 'Rook 1', move: 'r7' },
  { code: '0x87', piece: 'Rook 1', move: 'f5' },
  { code: '0x8a', piece: 'Knight 1', move: 'b2 r1' },
  { code: '0x8b', piece: 'Pawn 1', move: 'f1 r1' },
  { code: '0x8c', piece: 'King ', move: 'b1 l1' },
  { code: '0x8e', piece: 'Queen 2', move: 'f2 l2' },
  { code: '0x8f', piece: 'Queen 1', move: 'r7' },
  { code: '0x92', piece: 'Queen 2', move: 'f1 r1' },
  { code: '0x94', piece: 'Queen 1', move: 'f3' },
  { code: '0x96', piece: 'Pawn 2', move: 'f1 r1' },
  { code: '0x97', piece: 'King ', move: 'l1' },
  { code: '0x98', piece: 'Rook 1', move: 'r3' },
  { code: '0x99', piece: 'Rook 1', move: 'f4' },
  { code: '0x9a', piece: 'Queen 1', move: 'f6' },
  { code: '0x9b', piece: 'Pawn 3', move: 'f2' },
  { code: '0x9d', piece: 'Queen 1', move: 'f2' },
  { code: '0x9f', piece: 'Bishop 2', move: 'f4 l4' },
  { code: '0xa0', piece: 'Queen 2', move: 'f3' },
  { code: '0xa2', piece: 'Queen 1', move: 'f2 r2' },
  { code: '0xa3', piece: 'Pawn 8', move: 'f1' },
  { code: '0xa5', piece: 'Rook 2', move: 'f5' },
  { code: '0xa9', piece: 'Rook 2', move: 'r2' },
  { code: '0xab', piece: 'Queen 2', move: 'f6 l6' },
  { code: '0xad', piece: 'Rook 2', move: 'r4' },
  { code: '0xae', piece: 'Queen 2', move: 'f3 r3' },
  { code: '0xb0', piece: 'Queen 2', move: 'f4' },
  { code: '0xb1', piece: 'Pawn 6', move: 'f2' },
  { code: '0xb2', piece: 'Bishop 1', move: 'f6 l6' },
  { code: '0xb5', piece: 'Rook 2', move: 'r5' },
  { code: '0xb7', piece: 'Queen 1', move: 'f5' },
  { code: '0xb9', piece: 'Bishop 2', move: 'f3 r3' },
  { code: '0xbb', piece: 'Pawn 5', move: 'f1' },
  { code: '0xbc', piece: 'Queen 2', move: 'r5' },
  { code: '0xbd', piece: 'Queen 2', move: 'f2' },
  { code: '0xbe', piece: 'King ', move: 'r1' },
  { code: '0xc1', piece: 'Bishop 1', move: 'f2 r2' },
  { code: '0xc2', piece: 'Bishop 2', move: 'f2 r2' },
  { code: '0xc3', piece: 'Bishop 1', move: 'f2 l2' },
  { code: '0xc4', piece: 'Rook 2', move: 'r1' },
  { code: '0xc5', piece: 'Rook 2', move: 'f4' },
  { code: '0xc6', piece: 'Queen 2', move: 'f5' },
  { code: '0xc7', piece: 'Pawn 7', move: 'f1 l1' },
  { code: '0xc8', piece: 'Pawn 7', move: 'f2' },
  { code: '0xc9', piece: 'Queen 2', move: 'f7' },
  { code: '0xca', piece: 'Bishop 2', move: 'f3 l3' },
  { code: '0xcb', piece: 'Pawn 6', move: 'f1' },
  { code: '0xcc', piece: 'Bishop 2', move: 'f5 l5' },
  { code: '0xcd', piece: 'Rook 1', move: 'r2' },
  { code: '0xcf', piece: 'Pawn 4', move: 'f1' },
  { code: '0xd1', piece: 'Pawn 2', move: 'f1 l1' },
  { code: '0xd2', piece: 'Knight 2', move: 'f1 r2' },
  { code: '0xd3', piece: 'Knight 2', move: 'f1 l2' },
  { code: '0xd7', piece: 'Queen 1', move: 'f1 l1' },
  { code: '0xd8', piece: 'Rook 2', move: 'r6' },
  { code: '0xd9', piece: 'Queen 1', move: 'f2 l2' },
  { code: '0xda', piece: 'Knight 1', move: 'b2 l1' },
  { code: '0xdb', piece: 'Pawn 1', move: 'f2' },
  { code: '0xde', piece: 'Pawn 5', move: 'f1 l1' },
  { code: '0xdf', piece: 'King ', move: 'f1 l1' },
  { code: '0xe0', piece: 'Knight 2', move: 'b1 r2' },
  { code: '0xe1', piece: 'Rook 1', move: 'f7' },
  { code: '0xe3', piece: 'Rook 2', move: 'f3' },
  { code: '0xe5', piece: 'Queen 1', move: 'r4' },
  { code: '0xe6', piece: 'Pawn 4', move: 'f2' },
  { code: '0xe7', piece: 'Queen 1', move: 'f4 r4' },
  { code: '0xe8', piece: 'Rook 1', move: 'f2' },
  { code: '0xe9', piece: 'Knight 1', move: 'b1 r2' },
  { code: '0xeb', piece: 'Pawn 4', move: 'f1 r1' },
  { code: '0xec', piece: 'Pawn 1', move: 'f1' },
  { code: '0xed', piece: 'Queen 1', move: 'f7 r7' },
  { code: '0xee', piece: 'Queen 2', move: 'f1 l1' },
  { code: '0xef', piece: 'Rook 1', move: 'r4' },
  { code: '0xf0', piece: 'Queen 2', move: 'r7' },
  { code: '0xf1', piece: 'Queen 1', move: 'f1 r1' },
  { code: '0xf3', piece: 'Knight 2', move: 'f2 l1' },
  { code: '0xf4', piece: 'Rook 2', move: 'f2' },
  { code: '0xf5', piece: 'Bishop 2', move: 'f1 r1' },
  { code: '0xf6', piece: 'Long Castle', move: 'O-O-O' },
  { code: '0xf7', piece: 'Knight 1', move: 'f1 l2' },
  { code: '0xf8', piece: 'Queen 2', move: 'r1' },
  { code: '0xf9', piece: 'Queen 2', move: 'f6' },
  { code: '0xfa', piece: 'Queen 2', move: 'r3' },
  { code: '0xfb', piece: 'Queen 2', move: 'f2 r2' },
  { code: '0xfd', piece: 'Queen 1', move: 'f7' },
  { code: '0xfe', piece: 'Queen 2', move: 'f3 l3' },
]
export default CTGMoveService
