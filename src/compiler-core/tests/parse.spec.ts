import { NodeType } from '../src/ast'
import { baseParse } from '../src/parse'

describe('Parse', () => {
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const interpolationStr = '{{ message }}'
      const ast = baseParse(interpolationStr)
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.INTERPOLATION,
        content: {
          type: NodeType.SIMPLE_EXPRESSION,
          content: 'message',
        },
      })
    })
  })
  describe('element', () => {
    test('simple element', () => {
      const elementStr = '<div></div>'
      const ast = baseParse(elementStr)
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: 'div',
        children: [],
      })
    })
  })
  describe('text', () => {
    test('simple text', () => {
      const textStr = 'simple text'
      const ast = baseParse(textStr)
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.TEXT,
        content: 'simple text',
      })
    })
  })
  test('happy path', () => {
    const ast = baseParse('<div>hi,{{message}}</div>')
    expect(ast.children[0]).toStrictEqual({
      type: NodeType.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeType.TEXT,
          content: 'hi,',
        },
        {
          type: NodeType.INTERPOLATION,
          content: {
            type: NodeType.SIMPLE_EXPRESSION,
            content: 'message',
          },
        },
      ],
    })
  })
})
