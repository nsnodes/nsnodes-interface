'use server';

export async function verifyNSKidsPassword(answer: string): Promise<boolean> {
  const correctAnswer = process.env.NSKIDS_PASSWORD;

  if (!correctAnswer) {
    console.error('NSKIDS_PASSWORD environment variable is not set');
    return false;
  }

  // Case-insensitive comparison, trim whitespace
  return answer.trim().toLowerCase() === correctAnswer.toLowerCase();
}
