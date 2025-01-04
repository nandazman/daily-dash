export type HabitHistory = {
  id: number;
  habit_id: number; 
  action_date: number;
  action_type: 'increase' | 'stop' | 'restart' | 'fail';
  note?: string;
}