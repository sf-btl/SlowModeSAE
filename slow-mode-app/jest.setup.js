import '@testing-library/jest-dom'

// Polyfill pour TransformStream (requis pour Jest avec Playwright installé)
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = class TransformStream {
    constructor() {}
  }
}