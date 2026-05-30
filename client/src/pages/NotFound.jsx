import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-4xl font-bold text-neutral-heading mb-2">404</h1>
      <p className="text-neutral-body/60 mb-6">This page doesn&apos;t exist.</p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
