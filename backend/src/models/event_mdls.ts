import mongoose, { Document, Schema } from "mongoose";

export interface ICalendarEvent extends Document {
    title: string;
    date: Date;
    description: string;
    type: string;
    tags: string[];
}

const CalendarEventSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
     },
    title: {type: String, required: true},
    date: {type: Date, required: true},
    description: {type: String, required: false},
    type: {type: String, required: true},
    tags: [{type: String}]
})

export default mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema)