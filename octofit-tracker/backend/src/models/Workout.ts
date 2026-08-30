import mongoose, { Schema, type Document } from 'mongoose';

export interface IWorkout extends Document {
  title: string;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  focus: string;
}

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard'],
      default: 'moderate',
    },
    focus: { type: String, required: true },
  },
  { timestamps: true }
);

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
