import * as utils from '../src/scripts/utils'
import * as constants from '../src/scripts/constants'

test('parse style', () => {
    expect(utils.parseNumberFromStyle(12)).toBe(12)
    expect(utils.parseNumberFromStyle("12px")).toBe(12)
    expect(utils.parseNumberFromStyle(undefined)).toBe(undefined)
})

test('merge object', () => {
    const target = {
        a: 1,
        b: 2,
        c: {
            d: 1,
            f: 2,
            c: 3,
            ss: {
                xx: "aa",
                yy: "sdfsad"
            }
        }
    }

    const source = {
        a: 2,
        b: 1,
        c: {
            f: 3,
            ss: {
                yy: "bb"
            }
        }
    }

    const expectRes = {
        a: 2,
        b: 1,
        c: {
            d: 1,
            f: 3,
            c: 3,
            ss: {
                xx: "aa",
                yy: "bb"
            }
        }
    }
    expect(utils.merge(target, source)).toStrictEqual(expectRes)
})

// test("found flat config", () => {
//     const expectOutput = [
//         { path: [ 'style', 'width' ], config: { name: '长度', type: 'Input' } },
//         {
//           path: [ 'style', 'height' ],
//           config: { name: '宽度', type: 'Input' }
//         },
//         {
//           path: [ 'style', 'backgroundColor' ],
//           config: { name: '填充', type: 'Input' }
//         },
//         {
//           path: [ 'style', 'border' ],
//           config: { name: '线条', type: 'Input' }
//         },
//         {
//             path: [ 'config1'],
//             config: { name: 'test config value', type: 'RichText' }
//         }
//       ]
//     const configs = {
//         ...constants.BASE_EDITOR_CONFIG, 
//         config1: {
//             name: "test config value",
//             type: "RichText"
//         }
//     }
//     const output = utils.flatConfigs(configs)
//     expect(output).toStrictEqual(expectOutput)
// })


test("group by", () => {
        const data1 = [
            {a: 1, b: 2},
            {a: 2, b: 2},
            {a: 2, b: 2},
            {a: 3, b: 2},
            {a: 3, b: 2}
        ]
        expect(utils.groupBy(data1, x => x.a)).toStrictEqual({
            1: [{a: 1, b: 2}],
            2: [{a: 2, b: 2}, {a: 2, b: 2}],
            3: [{a: 3, b: 2}, {a: 3, b: 2}]
        });
    }
)