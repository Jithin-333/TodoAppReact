import React, { Component } from 'react';
import "./TodoApp.css";
import Swal from 'sweetalert2';



export default class TodoApp extends Component {
    state = {
        input: "",
        items: [],
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
            if (items.includes(input.trim())) {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "Item is Already in the List!",
                    
                  });
            } else {
                this.setState({
                    items: [input, ...items],
                    input: ""
                });
            }
        }
    };

    saveEditedItem = event => {
        event.preventDefault();
        const { editInput, editIndex, items } = this.state;

        if (editInput.trim()) {
            // Check if the edited input is already in the list and not the current editing item
            if (items.includes(editInput) && items[editIndex] !== editInput) {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "Item is Already in the List!",
                    
                  });
            } else {
                const updatedItems = items.map((item, index) =>
                    index === editIndex ? editInput : item
                );
                this.setState({
                    items: updatedItems,
                    editInput: "",
                    editIndex: null,
                    showModal: false // close modal after saving
                });
            }
        }
    };

    deleteItem = key => {
        this.setState({
            items: this.state.items.filter((data, index) => index !== key)
        });
    };

    editItem = index => {
        this.setState({
            editInput: this.state.items[index],
            editIndex: index,
            showModal: true // show modal on edit click
        });
    };

    closeModal = () => {
        this.setState({
            showModal: false,
            editInput: "",
            editIndex: null
        });
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
                        <li key={index}>
                            {index + 1}. {item}
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

                {/* Modal for Editing */}
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
