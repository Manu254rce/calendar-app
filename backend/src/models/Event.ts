import mongoose, { Document, Schema as MongooseSchema } from "mongoose";

export interface ICalendarEvent extends Document {
    title: string;
    date: Date;
    description: string;
    type: string;
    tags: string[];
}

const CalendarEventSchema: MongooseSchema = new MongooseSchema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    tags: [{type: String}]
})

export default mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema)