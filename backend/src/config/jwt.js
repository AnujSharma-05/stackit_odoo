export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';