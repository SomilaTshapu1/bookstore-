
//Book Class: Represents a book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI Tasks
class UI{
    static displayBooks(){
        
       const books = Store.getBooks();

       books.forEach((book)=> UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete"> Delete <i class="fas fa-trash-alt"></i></a></td>
        `;
        list.appendChild(row);
    }
    
    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    static showAlert(message, clasName){
        const div = document.createElement('div');
        div.className = ` alert alert-${clasName}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //make vanish in 4 seconds
        setTimeout(() => document.querySelector('.alert').remove(),
        4000);

    }

    static clearFields(){
        document.querySelector('#title').value= '';
        document.querySelector('#author').value= '';
        document.querySelector('#isbn').value= '';
    }
}

//Store Class: Handles Storage

 class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;

    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
        
    }
    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach( (book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }

        });

        localStorage.setItem('books', JSON.stringify(books));
        
    }
 }

//Event: Display books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=>
 {

    //prevent actual submit
    e.preventDefault();


    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validation 
    if(title ==='' || author ==='' || isbn ==='' ) {
       UI.showAlert('please fill in all fields', 'danger');
    }else{
          //instatiate  book
    const book = new Book(title, author, isbn);
   
    //Add book to the user interface
   UI.addBookToList(book);

   //add book to store
   Store.addBook(book);

   //show success message 
   UI.showAlert('Book added', 'success')

   // Clear fields
UI.clearFields();

    }
});

//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e)=>{
   
    //remove book from the UI
    UI.deleteBook(e.target)

    //remove from the store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //remove message
    UI.showAlert('Book removed', 'warning')
});
