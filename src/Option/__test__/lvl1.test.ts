import { main, moltiplicaPerDue } from "../lvl1";

describe('moltiplicaPerDue', () => {
    it('should be multiply a value by 2', () => {
        expect(moltiplicaPerDue(2)).toBe(4);
    });
    
});

describe('main', () => {
    it('should return an error if the value is null', () => {
        expect(() => main(null)).toThrow(/Nessun valore valido/);
    });
});