declare global {
  namespace Express {
    interface Request {
      userId?: string; // Change string to number or ObjectId depending on your setup
    }
  }
}
export {};