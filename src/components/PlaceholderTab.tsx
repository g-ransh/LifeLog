import { Construction } from 'lucide-react';

interface PlaceholderTabProps {
  label: string;
  description?: string;
}

export default function PlaceholderTab({ label, description }: PlaceholderTabProps) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: 400, padding: 32 }}>
      <div
        className="flex items-center justify-center rounded-2xl mb-4"
        style={{ width: 64, height: 64, background: '#141414', border: '1px solid #2a2a2a' }}
      >
        <Construction size={28} color="#333" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 8 }}>{label}</h2>
      <p style={{ fontSize: 13, color: '#333', textAlign: 'center', maxWidth: 240 }}>
        {description || 'Coming soon. This section is under construction.'}
      </p>
    </div>
  );
}
