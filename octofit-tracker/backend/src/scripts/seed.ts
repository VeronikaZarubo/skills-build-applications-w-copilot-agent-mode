import mongoose from 'mongoose';
import { Activity } from '../models/Activity.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { Workout } from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const createdUsers = await User.insertMany([
      { name: 'Avery Chen', email: 'avery.chen@example.com', fitnessLevel: 'intermediate' },
      { name: 'Morgan Patel', email: 'morgan.patel@example.com', fitnessLevel: 'advanced' },
      { name: 'Jordan Lee', email: 'jordan.lee@example.com', fitnessLevel: 'beginner' },
    ]);

    const createdTeams = await Team.insertMany([
      { name: 'Velocity', members: 3, focus: 'HIIT' },
      { name: 'Summit', members: 2, focus: 'Strength' },
    ]);

    await User.updateMany(
      { _id: { $in: createdUsers.map((user) => user._id) } },
      { team: createdTeams[0]._id }
    );

    const activitySeed = [
      { userId: createdUsers[0]._id, type: 'Run', duration: 30, calories: 280 },
      { userId: createdUsers[1]._id, type: 'Lift', duration: 45, calories: 320 },
      { userId: createdUsers[2]._id, type: 'Cycle', duration: 25, calories: 220 },
    ];

    const createdActivities = await Activity.insertMany(activitySeed);

    await Leaderboard.insertMany([
      { userId: createdUsers[1]._id, points: 980, rank: 1 },
      { userId: createdUsers[0]._id, points: 920, rank: 2 },
      { userId: createdUsers[2]._id, points: 870, rank: 3 },
    ]);

    await Workout.insertMany([
      { title: 'Core Burn', duration: 20, difficulty: 'moderate', focus: 'Abs' },
      { title: 'Sprint Circuit', duration: 30, difficulty: 'hard', focus: 'Cardio' },
      { title: 'Mobility Reset', duration: 15, difficulty: 'easy', focus: 'Recovery' },
    ]);

    console.log('Database seeding complete');
    console.log('Created users:', createdUsers.length);
    console.log('Created teams:', createdTeams.length);
    console.log('Created activities:', createdActivities.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
