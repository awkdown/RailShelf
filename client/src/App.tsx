import { useState, useEffect } from 'react';
import BookCard from './components/BookCard';
import type {Book} from './types/Book';
import AddBookForm from './components/AddBookForm';
import EditBookForm from './components/EditBookForm';
import LoginForm from "./components/LoginForm.tsx";
import { API_BASE } from './config';

function App() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );

    useEffect(() => {
        fetchBooks();
    }, [search, category]);

    function handleLogout() {
        localStorage.removeItem('token');
        setToken(null);
    }

    async function fetchBooks() {
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (category) params.set('category', category);

            const res = await fetch(`${API_BASE}/api/books?${params}`);
            const data = await res.json();
            setBooks(data);
        } catch (err) {
            console.error('Failed to fetch books:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        // Ask the user to confirm before deleting
        if (!window.confirm(
            'Are you sure you want to delete this book?'
        )) {
            return;
        }

        const res = await fetch(`${API_BASE}/api/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
            fetchBooks();  // refresh the grid
        }
    }

    if (loading) return <p className="p-6">Loading…</p>;

    if (!token) {
        return (
            <LoginForm
                onLogin={(t) => {
                    localStorage.setItem('token', t);
                    setToken(t);
                }}
            />
        );
    }

    return (

        <main className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">RailShelf</h1>
                <button
                    onClick={handleLogout}
                    className="text-sm text-slate-500 hover:text-slate-700
               underline"
                >
                    Log Out
                </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search by title, author, or ISBN…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border
             border-slate-300 focus:outline-none
             focus:border-sky-400 focus:ring-1
             focus:ring-sky-400"
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-300"
                >
                    <option value="">All Categories</option>
                    <option value="history">History</option>
                    <option value="signalling">Signalling</option>
                    <option value="photography">Photography</option>
                    <option value="infrastructure">Infrastructure</option>
                </select>
            </div>
            <h1 className="text-3xl font-bold mb-6">RailShelf</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2
                      lg:grid-cols-3 gap-6">
                {books.map((book) =>
                    editingBook?.id === book.id ? (
                        <EditBookForm
                            token={token}
                            key={book.id}
                            book={book}
                            onSave={() => {
                                setEditingBook(null);
                                fetchBooks();
                            }}
                            onCancel={() => setEditingBook(null)}
                        />
                    ) : (
                        <BookCard
                            key={book.id}
                            book={book}
                            onDelete={handleDelete}
                            onEdit={setEditingBook}
                        />

                    ))}
            </div>
            {/* Below the grid */}
            {showAddForm ? (
                <AddBookForm
                    token={token}
                    onBookAdded={() => {
                        setShowAddForm(false);
                        fetchBooks();
                    }}
                    onCancel={() => setShowAddForm(false)}
                />
            ) : (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-6 w-full py-3 border-2 border-dashed
             border-slate-300 rounded-xl text-slate-500
             hover:border-sky-400 hover:text-sky-600
             transition-colors font-semibold"
                >
                    + Add a Book
                </button>
            )}

        </main>
    );
}

export default App;
