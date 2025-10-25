export const STATUS = [
    'READING',
    'FINISHED',
    'PAUSED',
    'DROPPED',
    'ON LIST'
] as const;

export type Status = typeof STATUS[number];