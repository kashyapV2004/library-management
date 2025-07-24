document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bookForm = document.getElementById('book-form');
    const bookList = document.getElementById('book-list');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    
    // Load books from local storage
    loadBooks();
    
    // Event Listeners
    bookForm.addEventListener('submit', addBook);
    searchInput.addEventListener('input', filterBooks);
    filterSelect.addEventListener('change', filterBooks);
    
    // Load books from local storage
    function loadBooks() {
        const books = getBooksFromStorage();
        
        books.forEach(book => {
            addBookToDOM(book);
        });
    }
    
    // Add a new book
    function addBook(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        const status = document.getElementById('status').value;
        
        // Create book object
        const book = {
            id: Date.now(),
            title,
            author,
            isbn,
            status
        };
        
        // Add to DOM
        addBookToDOM(book);
        
        // Add to local storage
        addBookToStorage(book);
        
        // Clear form
        bookForm.reset();
    }
    
    // Add book to DOM
    function addBookToDOM(book) {
        const row = document.createElement('tr');
        row.dataset.id = book.id;
        
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td class="status-${book.status.toLowerCase().replace(' ', '-')}">${book.status}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${book.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-id="${book.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        bookList.appendChild(row);
        
        // Add event listeners to buttons
        row.querySelector('.edit-btn').addEventListener('click', editBook);
        row.querySelector('.delete-btn').addEventListener('click', deleteBook);
    }
    
    // Edit book
    function editBook(e) {
        const bookId = parseInt(e.target.closest('button').dataset.id);
        const books = getBooksFromStorage();
        const book = books.find(book => book.id === bookId);
        
        if (book) {
            // Fill form with book data
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('isbn').value = book.isbn;
            document.getElementById('status').value = book.status;
            
            // Remove book from storage and DOM
            deleteBookFromStorage(bookId);
            document.querySelector(`tr[data-id="${bookId}"]`).remove();
        }
    }
    
    // Delete book
    function deleteBook(e) {
        if (confirm('Are you sure you want to delete this book?')) {
            const bookId = parseInt(e.target.closest('button').dataset.id);
            
            // Remove from DOM
            document.querySelector(`tr[data-id="${bookId}"]`).remove();
            
            // Remove from storage
            deleteBookFromStorage(bookId);
        }
    }
    
    // Filter books based on search and status
    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilter = filterSelect.value;
        const books = document.querySelectorAll('#book-list tr');
        
        books.forEach(book => {
            const title = book.querySelector('td:nth-child(1)').textContent.toLowerCase();
            const author = book.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const isbn = book.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const status = book.querySelector('td:nth-child(4)').textContent;
            
            const matchesSearch = title.includes(searchTerm) || 
                                author.includes(searchTerm) || 
                                isbn.includes(searchTerm);
            
            const matchesStatus = statusFilter === 'all' || status === statusFilter;
            
            if (matchesSearch && matchesStatus) {
                book.style.display = '';
            } else {
                book.style.display = 'none';
            }
        });
    }
    
    // Local Storage Functions
    function getBooksFromStorage() {
        return JSON.parse(localStorage.getItem('books')) || [];
    }
    
    function addBookToStorage(book) {
        const books = getBooksFromStorage();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    
    function deleteBookFromStorage(id) {
        let books = getBooksFromStorage();
        books = books.filter(book => book.id !== id);
        localStorage.setItem('books', JSON.stringify(books));
    }
});