export class UserProfile {
    constructor(
        public fullname: string,
        public role: string,
        public createdAt?: string,
        public email?: string,
        public status?: boolean,
        public uid?: string
    ){}
}