import express from 'express';
import mongoose from 'mongoose';
import { Activity } from './models/Activity.js';
import { Leaderboard } from './models/Leaderboard.js';
import { Team } from './models/Team.js';
import { User } from './models/User.js';
import { Workout } from './models/Workout.js';

const app = express();
const port = 8000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (typeof origin === 'string') {
    const isAllowedOrigin = allowedOrigins.has(origin)
      || /^https:\/\/.+-(5173|8000)\.app\.github\.dev$/.test(origin);

    if (isAllowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'OctoFit backend is running',
    baseUrl,
  });
});

app.get('/api/users/', async (_req, res) => {
  const users = await User.find().lean();
  res.json({ success: true, data: users, baseUrl });
});

app.get('/api/teams/', async (_req, res) => {
  const teams = await Team.find().lean();
  res.json({ success: true, data: teams, baseUrl });
});

app.get('/api/activities/', async (_req, res) => {
  const activities = await Activity.find().populate('userId').lean();
  res.json({ success: true, data: activities, baseUrl });
});

app.get('/api/leaderboard/', async (_req, res) => {
  const leaderboard = await Leaderboard.find().populate('userId').lean();
  res.json({ success: true, data: leaderboard, baseUrl });
});

app.get('/api/workouts/', async (_req, res) => {
  const workouts = await Workout.find().lean();
  res.json({ success: true, data: workouts, baseUrl });
});

app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({ success: true, data: user, baseUrl });
});

app.get('/api/teams/:id', async (req, res) => {
  const team = await Team.findById(req.params.id).lean();
  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }
  return res.json({ success: true, data: team, baseUrl });
});

app.get('/api/activities/:id', async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate('userId').lean();
  if (!activity) {
    return res.status(404).json({ success: false, message: 'Activity not found' });
  }
  return res.json({ success: true, data: activity, baseUrl });
});

app.get('/api/leaderboard/:id', async (req, res) => {
  const entry = await Leaderboard.findById(req.params.id).populate('userId').lean();
  if (!entry) {
    return res.status(404).json({ success: false, message: 'Leaderboard entry not found' });
  }
  return res.json({ success: true, data: entry, baseUrl });
});

app.get('/api/workouts/:id', async (req, res) => {
  const workout = await Workout.findById(req.params.id).lean();
  if (!workout) {
    return res.status(404).json({ success: false, message: 'Workout not found' });
  }
  return res.json({ success: true, data: workout, baseUrl });
});

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB at octofit_db');

    app.listen(port, () => {
      console.log(`OctoFit API listening on http://localhost:${port}`);
      console.log(`Codespaces base URL: ${baseUrl}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer();