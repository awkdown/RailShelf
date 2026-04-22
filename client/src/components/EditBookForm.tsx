import { useState, type SyntheticEvent } from 'react';
import type { Book } from '../types/Book';

interface EditBookFormProps {
    book: Book;
    onSave: () => void;
    onCancel: () => void;
    token: string;
}

export default function EditBookForm(
    { book, onSave, onCancel, token }: EditBookFormProps
) {
    // Pre-fill each field with the book's current values.
    // These are independent copies — editing them does NOT
    // change the original book object.
    const [title, setTitle] = useState(book.title);
    const [isbn, setIsbn] = useState(book.isbn);
    const [publisher, setPublisher] = useState(book.publisher);
    const [year, setYear] = useState(String(book.year));
    const [category, setCategory] = useState(book.category);
    const [status, setStatus] = useState(book.status);

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        // PATCH sends the fields we want to update.
        // The server merges them with the existing record.
        const res = await fetch(`/api/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                isbn,
                publisher,
                year: Number(year),
                category,
                status,
            }),
        });

        if (res.ok) onSave();
    }

    return (
        <div className="bg-sky-50 p-4 rounded-xl border
                    border-sky-200">
            <h3 className="font-bold text-slate-900 mb-3">
                Editing: {book.title}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block text-sm font-medium
                        text-slate-700">Title</label>
                <input type="text" value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       className="w-full px-3 py-2 border rounded-lg" />

                <label className="block text-sm font-medium
                        text-slate-700">ISBN</label>
                <input type="text" value={isbn}
                       onChange={(e) => setIsbn(e.target.value)}
                       className="w-full px-3 py-2 border rounded-lg" />

                <label className="block text-sm font-medium
                        text-slate-700">Publisher</label>
                <input type="text" value={publisher}
                       onChange={(e) => setPublisher(e.target.value)}
                       className="w-full px-3 py-2 border rounded-lg" />

                <label className="block text-sm font-medium
                        text-slate-700">Year</label>
                <input type="number" value={year}
                       onChange={(e) => setYear(e.target.value)}
                       className="w-full px-3 py-2 border rounded-lg" />

                <label className="block text-sm font-medium
                        text-slate-700">Category</label>
                <select value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg">
                    <option value="history">History</option>
                    <option value="signalling">Signalling</option>
                    <option value="photography">Photography</option>
                    <option value="infrastructure">Infrastructure</option>
                </select>

                <label className="block text-sm font-medium
                        text-slate-700">Status</label>
                <select value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg">
                    <option value="owned">Owned</option>
                    <option value="wishlist">Wishlist</option>
                    <option value="lent out">Lent Out</option>
                </select>

                <div className="flex gap-2">
                    <button type="submit"
                            className="bg-sky-600 text-white px-4 py-2
                       rounded-lg hover:bg-sky-700">
                        Save
                    </button>
                    <button type="button" onClick={onCancel}
                            className="bg-slate-200 text-slate-700 px-4 py-2
                       rounded-lg hover:bg-slate-300">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
