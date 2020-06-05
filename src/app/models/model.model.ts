import { v4 as uuidv4 } from 'uuid';

export class Modele {
    public readonly id: string;
    public readonly date: Date;

    constructor() {
        this.id = this.generateID();
        this.date = new Date();
    }

    public generateID(): string {
        return uuidv4();
    }
}
