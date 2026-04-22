// render() mounts the component into a virtual DOM so we can inspect it
// screen gives us access to query the rendered output
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookCard from './BookCard';


// Create a fake book object to pass as a prop.
// This is NOT real data from the database — we control exactly what the
// component receives, so the test is predictable and repeatable.
const mockBook = {
    id: 1,
    title: 'British Railway Signalling',
    isbn: '9780711008980',
    publisher: 'Ian Allan',
    year: 1963,
    category: 'signalling',
    status: 'owned',
    author: {
        id: 1,
        name: 'Geoffrey Kichenside',
    },
};

describe('BookCard', () => {

    // Mock functions for the handler props. We don't care what they do
    // in these tests — they just need to exist so TypeScript is satisfied
    // and the component has something to call.
    const mockOnDelete = jest.fn();
    const mockOnEdit = jest.fn();

    it('renders the book title', () => {
        // render() creates the component in a virtual browser DOM.
        // After this line, the component's HTML exists in memory.
        render(
            <BookCard
                book={mockBook}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
            />
        );

        // screen.getByText() searches the rendered HTML for an element
        // that contains this exact text — just like a user scanning the page.
        // .toBeInTheDocument() checks that the element actually exists.
        expect(
            screen.getByText('British Railway Signalling')
        ).toBeInTheDocument();
    });

    it('renders the author name', () => {
        render(
            <BookCard
                book={mockBook}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
            />
        );
        expect(
            screen.getByText('Geoffrey Kichenside')
        ).toBeInTheDocument();
    });

    it('displays the book status', () => {
        render(
            <BookCard
                book={mockBook}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
            />
        );
        expect(screen.getByText('owned')).toBeInTheDocument();
    });

    it('calls onDelete when the delete button is clicked', async () => {
        // jest.fn() creates a 'mock function' — a fake function that
        // records every call made to it. We can later check:
        //   - Was it called at all?
        //   - How many times?
        //   - With what arguments?
        const handleDelete = jest.fn();

        // Pass the mock as the onDelete prop — the component will call it
        // when the user clicks Delete, just as it would call a real function
        render(<BookCard book={mockBook} onDelete={handleDelete} onEdit={mockOnEdit}/>);

        // screen.getByRole() finds an element by its accessibility role.
        // 'button' matches <button> elements. { name: /delete/i } matches
        // buttons whose visible text contains 'delete' (case-insensitive).
        const deleteButton = screen.getByRole('button', { name: /delete/i });

        // Simulate a user clicking the button. This is async because
        // userEvent waits for all resulting events to finish.
        await userEvent.click(deleteButton);

        // Check that our mock function was called exactly once
        expect(handleDelete).toHaveBeenCalledTimes(1);

        // Check that it was called with the book's id as the argument
        expect(handleDelete).toHaveBeenCalledWith(mockBook.id);
    });

});