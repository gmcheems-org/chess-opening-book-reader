import { expect } from 'chai'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

import { OpeningBooks } from '../index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const test_data = {
  'starting position': {
    FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    key: '463b96181691fc9c',
  },
  'position after e2e4': {
    FEN: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    key: '823c9b50fd114196',
  },
  'position after e2e4 d75': {
    FEN: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2',
    key: '0756b94461c50fb0',
  },
}

describe('Polyglot', function () {
  describe('Edge case with en passant', function () {
    it('should match key', function () {
      expect(
        OpeningBooks.Polyglot.polyglot_fen_hash(
          'r1b2rk1/ppp1q1b1/5nnp/3p4/5Pp1/2P5/PP4PP/RNKQ1B1R b - f3 0 1',
        ),
      ).to.eq('5106414c710d4a9e')
    })
  })

  describe('gm2001.bin', function () {
    let parser = new OpeningBooks.Polyglot.PolyglotParser()
    let allEntries = []
    before(async function () {
      parser.on('batch', (batch) => {
        allEntries = allEntries.concat(batch)
      })
      await parser.parse({
        buffer: fs.readFileSync(__dirname + '/sample-data/gm2001.bin').buffer,
      })
    })
    describe('check loaded', function () {
      it('has entries', function () {
        expect(allEntries.length).to.eq(30_415)
      })
    })
    describe('test hashes', function () {
      for (let name of Object.keys(test_data)) {
        it(
          name +
            ' ' +
            test_data[name].FEN +
            ' should equal ' +
            test_data[name].key,
          function () {
            expect(
              OpeningBooks.Polyglot.polyglot_fen_hash(test_data[name].FEN),
            ).to.eq(test_data[name].key)
          },
        )
      }
    })
    describe('test move lookups', function () {
      for (let name of Object.keys(test_data)) {
        it(name + ' has moves ', function () {
          let r = allEntries.find(
            (entry) =>
              entry._key ===
              OpeningBooks.Polyglot.polyglot_fen_hash(test_data[name].FEN),
          )
          expect(r).not.to.be.undefined
        })
      }
    })
  })
})
