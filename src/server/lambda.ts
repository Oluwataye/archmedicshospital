import serverless from 'serverless-http';
import app from './index';

// Wrap the express app with serverless-http
export const handler = serverless(app);
