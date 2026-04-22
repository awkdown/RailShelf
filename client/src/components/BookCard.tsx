import type { Book } from '../types/Book';

interface BookCardProps {
    book: Book;
    onDelete: (id: number) => void;
    onEdit: (book: Book) => void;
}

const statusStyles: Record<string, string> = {
    owned:      'bg-green-100 text-green-700',
    wishlist:   'bg-amber-100 text-amber-700',
    'lent out': 'bg-red-100 text-red-700',
};

export default function BookCard({ book, onDelete, onEdit }: BookCardProps) {
    const badge = statusStyles[book.status] ?? statusStyles['owned'];

    return (
        <article className="bg-white rounded-xl shadow-sm border
                        border-slate-200 overflow-hidden
                        hover:shadow-md transition-shadow">
            <div className="bg-slate-700 px-4 py-2">
        <span className="text-xs font-semibold text-slate-200
                         uppercase tracking-wide">
          {book.category}
        </span>
            </div>
            <div className="p-4">
                <h2 className="font-bold text-slate-900 text-lg line-clamp-2"
                    title={book.title}>
                    {book.title}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                    {book.author.name}
                </p>
                <dl className="mt-3 space-y-1 text-sm text-slate-700">
                    {book.isbn && (
                        <div className="flex justify-between">
                            <dt className="font-medium">ISBN</dt>
                            <dd className="text-slate-500 font-mono text-xs">
                                {book.isbn}
                            </dd>
                        </div>
                    )}
                    {book.publisher && (
                        <div className="flex justify-between">
                            <dt className="font-medium">Publisher</dt>
                            <dd className="text-slate-500">{book.publisher}</dd>
                        </div>
                    )}
                    {book.year && (
                        <div className="flex justify-between">
                            <dt className="font-medium">Year</dt>
                            <dd className="text-slate-500">{book.year}</dd>
                        </div>
                    )}
                </dl>
                <div className="mt-4">
          <span className={`inline-block px-3 py-1 text-xs
                           font-semibold rounded-full ${badge}`}>
            {book.status}
          </span>
                </div>
                <div className="mt-3 flex gap-4">
                    <button
                        onClick={() => onEdit(book)}
                        className="text-sm text-sky-600 hover:text-sky-800
                     hover:underline"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(book.id)}
                        className="text-sm text-red-600 hover:text-red-800
                     hover:underline"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}