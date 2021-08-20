import { v4 as uuidv4 } from 'uuid';

export class Administrateur {
    id: string;
    login: string;
    passe: string;

    constructor() {
        this.id = this.generateID();

    }

    generateID(): string {
        return uuidv4();
    }
}
