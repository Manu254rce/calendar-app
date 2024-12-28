import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  eventId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  eventId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IComment>('Comment', CommentSchema);