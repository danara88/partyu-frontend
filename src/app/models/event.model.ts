import { Region } from "./region.model";

export class Event {
    constructor(
        public _id?: string,
        public title?: string,
        public description?: string,
        public status?: boolean,
        public visibility?: number,
        public region?: Region,
        public createdAt?: string,
    ){}
}

