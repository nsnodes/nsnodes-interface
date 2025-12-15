import { generatePageMetadata } from '@/lib/utils/metadata';
import ArgentinaClient from './argentina-client';

export const metadata = generatePageMetadata(
  "Argentina Network State Events",
  "Network State events happening in Argentina. Connect with the growing Argentine Network State community."
);

export default function ArgentinaPage() {
  return <ArgentinaClient />;
}
