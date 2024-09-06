import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

/*
Option: Un tipo che rappresenta un valore opzionale, utile per gestire casi in cui un valore potrebbe non esistere

pipe: mi permette di concatenare le funzioni in modo da creare un flusso di dati

*/

const getValore = () => {
    return Math.random() > 0.5 ? 10 : null;
}

export const moltiplicaPerDue = (x: number) => x * 2;

const customError = Error('Nessun valore valido');

const valore = getValore();

/*
In questo esempio, la funzione main prende un valore numerico come argomento. 
Utilizza la funzione pipe per concatenare le funzioni O.fromNullable, O.map e O.getOrElseW. 
O.fromNullable converte il valore in un Option, O.map applica la funzione moltiplicaPerDue al valore se esiste, 
e O.getOrElseW gestisce il caso in cui il valore sia null fornendo un valore di default. 
Se il valore è null, viene lanciata un'eccezione con il messaggio "Nessun valore valido". 
La funzione main gestisce l'eccezione e stampa il messaggio di errore.
*/

export const main = (n :number | null) => {
    try {
        const res = pipe(n, O.fromNullable, O.map(moltiplicaPerDue), O.getOrElseW(() => {
            throw customError
        }));
        console.log(res);
    } catch (error: any) {
        console.log(error.message);
        throw error;
    }
}

main(valore);
