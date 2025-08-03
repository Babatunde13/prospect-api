import * as dotenv from 'dotenv';

dotenv.config();

export default {
  ORIGIN: '*',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:password@localhost:5432/nest',
  PORT: process.env.PORT || 3000,
  IsProd: process.env.NODE_ENV === 'production',
  ApiKeys: {
    openAI: process.env.OPEN_AI_API_KEY,
    claude: process.env.CLAUDE_API_KEY,
  },
};
