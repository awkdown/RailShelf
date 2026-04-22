import {useState,  type SyntheticEvent} from 'react';

interface LoginFormProps {
    onLogin: (token: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');

        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            setError('Invalid email or password');
            return;
        }

        const data = await res.json();
        onLogin(data.token);
    }

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                RailShelf - Log In
            </h1>
            {error && (
                <p className="text-red-600 text-sm mb-3">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email" placeholder="Email" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300
                     rounded-lg"
                />
                <input
                    type="password" placeholder="Password" required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300
                     rounded-lg"
                />
                <button
                    type="submit"
                    className="w-full bg-sky-600 text-white py-2
                     rounded-lg hover:bg-sky-700
                     transition-colors font-semibold"
                >
                    Log In
                </button>
            </form>
        </main>
    );
}
