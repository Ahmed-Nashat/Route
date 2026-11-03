class User {
    name;
    email;
    password;
    phone;
    age;
    _id = 0;
    noteBooks;
    constructor(name, email, password, phone, age) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.age = age;
        if (age < 18 || age > 60)
            throw new Error("Age must be between 18 and 60");
        this.age = age;
        this._id++;
        this.noteBooks = [];
    }
    addNoteBook(noteBookTitle) {
        this.noteBooks.push(noteBookTitle);
    }
    displayInfo() {
        console.log(`
       user name: ${this.name}, 
       user email: ${this.email}, 
       user age: ${this.age},
       user phone: ${this.phone},
       user id: ${this._id} 
       `);
    }
}
class Admin extends User {
    constructor(_id, name, email, password, phone, age) {
        super(name, email, password, phone, age);
    }
    manageNotes(notes, noteId, action) {
        if (action === " list")
            return notes.forEach((note) => console.log(note.preview()));
        else if (action === "delete" && noteId)
            return notes.filter((note) => note._id !== noteId);
        else
            throw new Error("Invalid action");
    }
}
class Note {
    createdBy;
    title;
    content;
    _id = 0;
    constructor(createdBy, title, content) {
        this.createdBy = createdBy;
        this.title = title;
        this.content = content;
        this._id++;
    }
    preview() {
        let message = [];
        const noteParts = this.content.split(" ");
        for (let i = 0; i < 5; i++) {
            message.push(noteParts[i]);
        }
        return message.join(" ") + "... . . ";
    }
}
class NoteBook {
    name;
    _user;
    _id = 0;
    _notes;
    constructor(name, _user) {
        this.name = name;
        this._user = _user;
        this._notes = [];
        this._id++;
        this._user.addNoteBook(name);
    }
    addNote(content, title) {
        const newNote = new Note(this._user.name, title, content);
        this._notes.push(newNote);
        console.log(`Added note: "${content}"`);
    }
    removeNote(title) {
        const initialLength = this._notes.length;
        this._notes = this._notes.filter((note) => note.title !== title);
        if (this._notes.length < initialLength) {
            console.log(`Removed note: "${title}"`);
        }
        else {
            console.log(`Note not found: "${title}"`);
        }
    }
    displayNotes() {
        if (this._notes.length === 0) {
            console.log("The notebook is empty.");
            return;
        }
        console.log(`\n${this._user.name}'s Notebook Contents:`);
        this._notes.forEach((note, index) => {
            console.log(`${index + 1}. ${note.content}`);
        });
    }
}
class Storage {
    storage = [];
    addItem(item) {
        this.storage.push(item);
    }
    removeItem(item) {
        const initialLength = this.storage.length;
        this.storage = this.storage.filter((i) => i !== item);
        if (this.storage.length < initialLength) {
            console.log(`Removed item: "${item}"`);
        }
        else {
            console.log(`Item not found: "${item}"`);
        }
    }
    getAllItems() {
        if (this.storage.length === 0) {
            console.log("Storage is empty.");
        }
        else {
            this.storage.forEach((item, index) => {
                console.log(`${index + 1}.`, item);
            });
        }
        return this.storage;
    }
}
const user = new User("Ahmed", "ahmed@example.com", "password123", "01234567890", 25);
const admin = new Admin(99, "AdminUser", "admin@test.com", "admin123", "01234567890", 30);
export {};
// const myNotebook = new NoteBook("notebook_1", user);
// myNotebook.addNote("Complete TypeScript assignment", "note_1");
// myNotebook.addNote("Review OOP Composition principles", "note_2");
// myNotebook.displayNotes();
// myNotebook.removeNote("note_1");
// const myStorage = new Storage<string>();
// myStorage.addItem("First Note");
// myStorage.addItem("Second Note");
// const items = myStorage.getAllItems();
// console.log(items);
