export type IssueLevel = 'error' | 'warning';

export type Issue = {
  code: string;
  file: string;
  level: IssueLevel;
  message: string;
};

const symbols: Record<IssueLevel, string> = {
  error: '✖',
  warning: '⚠',
};

export function renderIssues(issues: Issue[]): string {
  return issues
    .map((issue) => `${symbols[issue.level]} [${issue.code}] ${issue.file} — ${issue.message}`)
    .join('\n');
}

export function summarizeIssues(issues: Issue[]): { errors: number; warnings: number } {
  return {
    errors: issues.filter((issue) => issue.level === 'error').length,
    warnings: issues.filter((issue) => issue.level === 'warning').length,
  };
}
