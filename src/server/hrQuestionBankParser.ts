import fs from 'fs';
import path from 'path';
import { Question } from '../types.js';

export function parseHrQuestionBank(): Question[] {
  const filePath = path.join(process.cwd(), 'HR_Interview_Questions_Answers_and_Ratings(1).md');
  if (!fs.existsSync(filePath)) {
    console.warn('HR_Interview_Questions_Answers_and_Ratings(1).md not found at', filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const blocks = content.split(/^#\s+\d+\.\s+/m);
  const questions: Question[] = [];

  let count = 1;

  for (const block of blocks) {
    if (!block.trim() || block.includes('# Rating System')) continue;

    const lines = block.split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n');

    const qMatch = body.match(/### Question\s*\n([\s\S]*?)(?=### Sample Answer|### Rating|$)/i);
    const ansMatch = body.match(/### Sample Answer\s*\n([\s\S]*?)(?=### Rating|### Why This Works|$)/i);
    const ratingMatch = body.match(/### Rating\:\s*(.+)/i);
    const whyMatch = body.match(/### Why This Works\s*\n([\s\S]*?)(?=### Improve It By|### Avoid|### Notes|### Interview Tips|---|$)/i);
    const improveMatch = body.match(/### Improve It By\s*\n([\s\S]*?)(?=### Avoid|### Notes|### Interview Tips|---|$)/i);
    const avoidMatch = body.match(/### Avoid\s*\n([\s\S]*?)(?=### Notes|### Interview Tips|---|$)/i);
    const notesMatch = body.match(/### Important Notes\s*\n([\s\S]*?)(?=### Interview Tips|---|$)/i) ||
                       body.match(/### Interview Tips\s*\n([\s\S]*?)(?=---|$)/i);

    const questionText = qMatch ? qMatch[1].trim() : title;
    const sampleAnswer = ansMatch ? ansMatch[1].trim() : 'Sample answer provided in HR reference guide.';
    const rating = ratingMatch ? ratingMatch[1].trim() : '9/10';
    const whyThisWorks = whyMatch ? whyMatch[1].trim() : '';
    const improveItBy = improveMatch ? improveMatch[1].trim() : '';
    const avoid = avoidMatch ? avoidMatch[1].trim() : '';
    const importantNotes = notesMatch ? notesMatch[1].trim() : '';

    const id = `HR-Q-${count++}`;

    questions.push({
      id,
      categoryId: 'cat-hr',
      categoryName: 'HR Interview',
      type: 'hr' as any,
      title: `${count - 1}. ${title}`,
      description: questionText,
      createdAt: new Date().toISOString(),
      hrData: {
        sampleAnswer,
        rating,
        whyThisWorks,
        improveItBy,
        avoid,
        importantNotes,
        category: 'HR & Behavioural',
      },
    });
  }

  console.log(`Parsed ${questions.length} HR questions from HR_Interview_Questions_Answers_and_Ratings(1).md`);
  return questions;
}
