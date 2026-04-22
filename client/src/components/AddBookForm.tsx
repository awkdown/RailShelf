import { useState, type SyntheticEvent } from 'react';

interface AddBookFormProps {
    onBookAdded: () => void;
    onCancel: () => void;
    token: string;
}

export default function AddBookForm(
    { onBookAdded, onCancel, token }: AddBookFormProps
) {
    const [title, setTitle] = useState('');
    const [authorname, setAuthorname] = useState('');
    const [isbn, setIsbn] = useState('');
    const [publisher, setPublisher] = useState('');
    const [year, setYear] = useState('');
    const [category, setCategory] = useState('history');
    const [status, setStatus] = useState('owned');
    const [error, setError] = useState('');

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        // Prevent the browser from doing a full page reload
        e.preventDefault();
        setError('');

        // Send the form data to our POST endpoint.
        // Note the x-api-key header — our requireApiKey
        // middleware rejects requests without it.
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                authorname,
                isbn: isbn || undefined,
                publisher: publisher || undefined,
                year: year ? Number(year) : undefined,
                category,
                status,
            }),
        });

        if (!res.ok) {
            const data = await res.json();

            // If the server sent Zod validation details, show them
            if (data.details) {
                const messages = data.details
                    .map((d: { field: string; message: string }) => `${d.field}: ${d.message}`)
                    .join('\n');
                setError(messages);
            } else {
                setError(data.error || 'Failed to add book.');
            }

            return;
        }

        // Clear the form and notify the parent
        setTitle(''); setAuthorname(''); setIsbn('');
        setPublisher(''); setYear('');
        onBookAdded();
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm
                    border border-slate-200 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
                Add a Book
            </h2>

            {error && (
                <p className="text-red-600 text-sm mb-3">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Title *"
                    required
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />

                <input type="text" placeholder="Author name *" required
                       value={authorname}
                       onChange={(e) => setAuthorname(e.target.value)}
                       className="w-full px-3 py-2 border border-slate-300
                     rounded-lg" />

                <input
                    type="text"
                    placeholder="ISBN (10 or 13 digits)"
                    pattern="^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$"
                    title="ISBN must be exactly 10 or 13 digits"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />

                <input type="text" placeholder="Publisher"
                       value={publisher}
                       onChange={(e) => setPublisher(e.target.value)}
                       className="w-full px-3 py-2 border border-slate-300
                     rounded-lg" />

                <input
                    type="number"
                    placeholder="Year"
                    min={1800}
                    max={new Date().getFullYear()}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />

                <select value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300
                     rounded-lg">
                    <option value="history">History</option>
                    <option value="signalling">Signalling</option>
                    <option value="photography">Photography</option>
                    <option value="infrastructure">Infrastructure</option>
                </select>

                <select value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300
                     rounded-lg">
                    <option value="owned">Owned</option>
                    <option value="wishlist">Wishlist</option>
                    <option value="lent out">Lent Out</option>
                </select>

                <div className="flex gap-2">
                    <button type="submit"
                            className="bg-sky-600 text-white px-6 py-2
                       rounded-lg hover:bg-sky-700
                       transition-colors font-semibold">
                        Add Book
                    </button>
                    <button type="button" onClick={onCancel}
                            className="bg-slate-200 text-slate-700 px-6 py-2
                       rounded-lg hover:bg-slate-300">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
