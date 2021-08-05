import { Event } from './event.model';
import { User } from './user.model';

export class Invitation {
    constructor(
        public _id: string,
        public user: User | string,
        public event: Event,
        public message: string,
        public statusInvitation: number,
        public status: boolean,
        public createdAt: string,
        public updatedAt: string
    ){}
}

