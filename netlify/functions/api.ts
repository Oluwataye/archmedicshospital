import serverless from 'serverless-http';
import app from '../../src/server/index';

export const handler = serverless(app);
