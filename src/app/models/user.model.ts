export class User {
    constructor(
        public fullname: string,
        public email: string,
        public password?: string,
        public uid?: string,
    ) {}
}