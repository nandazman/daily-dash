export type StreakHistory = {
  id: number;
  streak_id: number; 
  action_date: number;
  action_type: 'increase' | 'stop' | 'restart' | 'fail';
  note?: string;
}