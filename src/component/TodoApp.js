import React, { Component } from 'react';
import "./TodoApp.css";
import Swal from 'sweetalert2';

export default class TodoApp extends Component {
    state = {
        input: "",
        items: [], // Items will be objects with text and completed status
        editInput: "",
        editIndex: null,
        showModal: false // to track modal visibility
    };

    componentDidMount() {
        const storedItems = localStorage.getItem('items');
        if (storedItems) {
            this.setState({
                items: JSON.parse(storedItems)
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.items !== this.state.items) {
            localStorage.setItem('items', JSON.stringify(this.state.items));
        }
    }

    handleChange = event => {
        this.setState({
            input: event.target.value
        });
    };

    handleEditChange = event => {
        this.setState({
            editInput: event.target.value
        });
    };

    storeItems = event => {
        event.preventDefault();
        const { input, items } = this.state;

        if (input.trim()) {
            if (items.some(item => item.text === input.trim())) {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "Item is Already in the List!",
                });
            } else {
                const newItem = { text: input, completed: false }; // Add completed status
                this.setState({
                    items: [newItem, ...items],
                    input: ""
                });
            }
        }
    };

    saveEditedItem = event => {
        event.preventDefault();
        const { editInput, editIndex, items } = this.state;

        if (editInput.trim()) {
            if (items.some((item, index) => item.text === editInput && index !== editIndex)) {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "Item is Already in the List!",
                });
            } else {
                const updatedItems = items.map((item, index) =>
                    index === editIndex ? { ...item, text: editInput } : item
                );
                this.setState({
                    items: updatedItems,
                    editInput: "",
                    editIndex: null,
                    showModal: false
                });
            }
        }
    };

    deleteItem = key => {
        this.setState({
            items: this.state.items.filter((_, index) => index !== key)
        });
    };

    editItem = index => {
        this.setState({
            editInput: this.state.items[index].text,
            editIndex: index,
            showModal: true
        });
    };

    closeModal = () => {
        this.setState({
            showModal: false,
            editInput: "",
            editIndex: null
        });
    };

    toggleComplete = index => {
        const updatedItems = this.state.items.map((item, idx) =>
            idx === index ? { ...item, completed: !item.completed } : item
        );
        this.setState({ items: updatedItems });
    };

    render() {
        const { input, items, editInput, showModal } = this.state;

        return (
            <div className="todo-container">
                <div>
                    <h1>TodoApp</h1>
                </div>

                <form className="input-section" onSubmit={this.storeItems}>
                    <input
                        type="text"
                        placeholder="Add new item"
                        value={input}
                        onChange={this.handleChange}
                    />
                    <button className="add-bttn">Add</button>
                </form>

                <ul className="item-list">
                    {items.map((item, index) => (
                        <li key={index} className={item.completed ? "completed" : ""}>
                            <span onClick={() => this.toggleComplete(index)}>
                                {item.completed ? "✔️" : "◻️"} {index + 1}.
                            </span>  {item.text}
                            <div>
                                <i
                                    className="fa-solid fa-edit"
                                    onClick={() => this.editItem(index)}
                                    title="Edit"
                                ></i>
                                <i
                                    className="fa-solid fa-trash-can"
                                    onClick={() => this.deleteItem(index)}
                                    title="Delete"
                                ></i>
                            </div>
                        </li>
                    ))}
                </ul>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Edit Item</h2>
                            <form onSubmit={this.saveEditedItem}>
                                <input
                                    type="text"
                                    value={editInput}
                                    onChange={this.handleEditChange}
                                    placeholder="Edit item"
                                />
                                <div className="modal-buttons">
                                    <button type="submit" className="save-bttn">Save</button>
                                    <button type="button" className="cancel-bttn" onClick={this.closeModal}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
// Todo App completed using Class based 
