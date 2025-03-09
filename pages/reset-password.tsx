import ResetPassword from '../components/ResetPassword';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center pt-16">
        <ResetPassword />
        <p className="text-center mt-4">
          Remember your password?{' '}
          <Link href="/signin" className="text-blue-500 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 