import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

// Funzione che potrebbe fallire
const divide = (a: number, b: number): O.Option<number> =>
  b === 0 ? O.none : O.some(a / b)

// Funzione per formattare il risultato
const format = (n: number): string => `Il risultato è ${n.toFixed(2)}`

// Funzione principale che compone le operazioni
const safeDivideAndFormat = (a: number, b: number): string =>
  pipe(
    divide(a, b),
    O.map(format),
    O.getOrElse(() => "Impossibile dividere per zero")
  )

// Esempi di utilizzo
console.log(safeDivideAndFormat(10, 2))  // Output: "Il risultato è 5.00"
console.log(safeDivideAndFormat(10, 0)) 