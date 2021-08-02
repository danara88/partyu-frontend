import { Event } from "./event.model";

export class Participant {
    constructor(
        public _id: string,
        public event: string | Event,
        public status: boolean,
        public createdAt: string,
        public updatedAt: string,
    ){}
}