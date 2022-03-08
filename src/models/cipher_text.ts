import { CircuitValue, Field, Group, prop} from "snarkyjs"


export class CipherText extends CircuitValue {
    @prop c1: Group;
    @prop c2: Group;
    @prop m: Field[];

    constructor(c1: Group, c2: Group, m: Field[]) {
        super();
        this.c1 = c1;
        this.c2 = c2;
        this.m = m;
    }
}