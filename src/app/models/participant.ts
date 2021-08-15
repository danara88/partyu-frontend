import { Event } from "./event.model";
import { User } from "./user.model";
import { Invitation } from './invitation.model';

export class Participant {
    constructor(
        public _id: string,
        public user: User,
        public event: string | Event,
        public invitation: string | Invitation,
        public status: boolean,
        public createdAt: string,
        public updatedAt: string,
    ){}
}