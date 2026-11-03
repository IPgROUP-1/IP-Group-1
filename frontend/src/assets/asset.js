export const NAV = [
  ['problem', 'Problem'],
  ['features', 'Features'],
  ['preview', 'Preview'],
  ['how', 'How it works'],
  ['roles', 'Roles'],
  ['faq', 'FAQ'],
];

export const FEATURES = [
  ['Kanban workflow', 'Organize tasks and bugs with clear ownership, priority and visible progress.'],
  ['Shared dashboard', 'Keep everyone aligned with weekly progress, due dates, and project status.'],
  ['Bug tracking', 'Capture issues with steps, priority labels, and status updates in one place.'],
  ['Team activity', 'See what changed, when it changed, and who made the update.'],
];

export const STEPS = [
  ['Create the project', 'Set up the workspace, invite your team and define the goals.'],
  ['Split the work', 'Break the project into tasks and assign each item to a team member.'],
  ['Track progress', 'Move cards through the board, log bugs and watch the dashboard update.'],
  ['Ship faster', 'Finish on time with a shared view of what is done and what still needs attention.'],
];

export const ROLES = [
  ['Project lead', 'Prioritize work, assign owners and keep the deadline visible to everyone.'],
  ['Developer', 'Claim tasks, track bugs and update the status without extra meetings.'],
  ['Tester', 'Report issues clearly, confirm fixes and keep the backlog under control.'],
];

export const BOARD = [
  ['To do', ['Write requirements', 'Add login integration', 'Review mockups']],
  ['In progress', ['Build dashboard UI', 'Fix API errors', 'Prepare release notes']],
  ['Done', ['Signup mockups', 'Backend setup', 'Team sync']],
];

export const TASK_CHART = [
  ['Done', 12, 'green'],
  ['In review', 6, 'amber'],
  ['Blocked', 2, 'red'],
  ['Open', 8, 'blue'],
];

export const BUG_CHART = [
  ['Low', 9, 'green'],
  ['Medium', 5, 'amber'],
  ['High', 3, 'red'],
  ['Critical', 1, 'dark'],
];

export const DUE_SOON = [
  ['Finish login flow', 'Today'],
  ['QA regression pass', 'Tomorrow'],
  ['Deploy demo build', 'Friday'],
];

export const TASK_CARD = {
  title: 'Implement dashboard widgets',
  desc: 'Build the summary cards and chart sections for the overview page.',
  fields: [
    ['Owner', 'Nina'],
    ['Priority', 'High'],
    ['Due', 'Today'],
  ],
  comment: ['Aisha', 'updated the checklist and attached the design notes'],
};

export const BUG_FORM = [
  ['Title', 'Signup retry error'],
  ['Severity', 'High'],
  ['Steps', 'Click create account > use duplicate email > error appears'],
  ['Status', 'Open'],
];

export const ACTIVITY = [
  ['Aisha', 'assigned a task to Nina', '2m ago'],
  ['Sam', 'reported a signup bug', '11m ago'],
  ['Liam', 'marked the dashboard as done', '1h ago'],
];

export const FAQ = [
  ['Can non-technical teams use it?', 'Yes. The board-style workflow is simple enough for students and small teams to manage without software training.'],
  ['Does it track bugs too?', 'Yes. Each bug can be tracked with priority, status and notes so it is not lost in chat.'],
  ['Can we invite teammates?', 'The app is designed for team work, so members can collaborate around tasks, bugs and project updates.'],
];
