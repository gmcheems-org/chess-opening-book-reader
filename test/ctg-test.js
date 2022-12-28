import { expect } from 'chai'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

import { key_from_fen, OpeningBooks } from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const test_fen = [
  'rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
  'rnbqkbnr/ppp1pppp/8/3p4/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
  'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -',
]

describe('CTG', function () {
  let parser = new OpeningBooks.CTG.CTGParser()
  let allEntries = []
  before(async function () {
    parser.on('batch', (batch) => {
      allEntries.push(...batch)
    })
    await parser.parse({
      buffer: fs.readFileSync(__dirname + '/sample-data/simple.ctg').buffer,
    })
  })
  describe('check loaded', function () {
    it('has entries', function () {
      expect(allEntries.length).to.eq(8)
    })
  })
  describe('check move lookup', function () {
    for (const fen of test_fen) {
      it(fen + ' has data', function () {
        let r = allEntries.find((entry) => entry.key === key_from_fen(fen))
        expect(r).not.to.be.undefined
      })
    }
  })
})
