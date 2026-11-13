export function worksheetIntent(params: Pick<URLSearchParams, 'getAll'>) {
  const subjects = params.getAll('subject');
  const subject = subjects.length === 1 && subjects[0] === 'english' ? 'english' : 'mathematics';
  const topics = params.getAll('operation');
  const topic = topics.length === 1 && (topics[0] === 'subtraction' || topics[0] === 'mixed') ? topics[0] : 'addition';
  return { subject, topic } as { subject: 'english' | 'mathematics'; topic: 'addition' | 'subtraction' | 'mixed' };
}
