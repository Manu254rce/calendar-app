import mongoose, { Document, Schema } from "mongoose";

export interface ICalendarEvent extends Document {
    title: string;
    date: Date;
    description: string;
    type: string;
    tags: string[];
}

const CalendarEventSchema: Schema = new Schema({
    title: {type: String, required: true},
    date: {type: Date, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    tags: [{type: String}]
})

export default mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema)