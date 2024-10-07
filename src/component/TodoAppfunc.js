import React, { useState, useEffect, useCallback } from 'react';
import './TodoAppfunc.css';

const TodoApp = () => {
    const [input, setInput] = useState(""); // State for input field
    const [items, setItems] = useState([]); // State to store the list of items
    const [editIndex, setEditIndex] = useState(null); // State to track the index of the item being edited
    const [isEditing, setIsEditing] = useState(false); // State to toggle modal visibility

    // Retrieve data from localStorage when component mounts
    useEffect(() => {
        const storedItems = localStorage.getItem('items');
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }
    }, []);

    // Update localStorage whenever the items state changes
    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items]);

    // Handle input change
    const handleChange = (event) => {
        setInput(event.target.value);
    };

    // Store new item or update existing item
    const storeItems = (event) => {
        event.preventDefault();

        if (input.trim()) {
            // Check if the item already exists
            if (items.includes(input) && editIndex === null) {
                alert("Item is already added!");
                return;
            }

            if (editIndex !== null) {
                // Editing an existing item
                const updatedItems = items.map((item, index) =>
                    index === editIndex ? input : item
                );
                setItems(updatedItems);
                setEditIndex(null); // Reset edit index
                setIsEditing(false); // Close modal after saving
            } else {
                // Adding a new item
                setItems([input, ...items]);
            }

            setInput(""); // Clear input field
        }
    };

    // Delete an item from the list
    const deleteItem = (index) => {
        const filteredItems = items.filter((_, i) => i !== index);
        setItems(filteredItems);
    };

    // Open the edit modal and set the input value to the selected item
    const editItem = (index) => {
        setInput(items[index]);
        setEditIndex(index);
        setIsEditing(true); // Show modal for editing
    };

    // Close the edit modal without saving
    const closeModal = () => {
        setInput("");
        setEditIndex(null);
        setIsEditing(false); // Close the modal
    };

    return (
        <div className='todo-container'>
            <div>
                <h1>TodoApp</h1>
            </div>

            {/* Input section for adding new items */}
            <form className='input-section' onSubmit={storeItems}>
                <input 
                    type='text'
                    value={input}
                    onChange={handleChange}
                    placeholder="Enter a new task"
                />
                <button className='add-bttn'>
                    Add
                </button>
            </form>

            {/* Display list of items */}
            <ul className='item-list'>
                {items.map((item, index) => (
                    <li key={index}>
                        {item}
                        <div>
                            <i
                                className="fa-solid fa-edit"
                                onClick={() => editItem(index)}
                                title="Edit"
                            ></i>
                            <i
                                className="fa-solid fa-trash-can"
                                onClick={() => deleteItem(index)}
                                title="Delete"
                            ></i>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal for editing items */}
            {isEditing && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Item</h2>
                        <input 
                            type='text'
                            value={input}
                            onChange={handleChange}
                            placeholder="Edit your task"
                        />
                        <div className="modal-buttons">
                            <button onClick={storeItems}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoApp;
