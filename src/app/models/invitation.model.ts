import { User } from './user.model';
export class Invitation {
    constructor(
        public user: string | User,
        public event: string | Event,
        public message: string,
        public statusInvitation: number,
        public status: boolean,
        public createdAt: string,
        public updatedAt: string
    ){}
}

