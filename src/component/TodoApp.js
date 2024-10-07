import React, { Component } from 'react'
import "./TodoApp.css";

export default class TodoApp extends Component {
    state = {
        input: "",
        items: []
    };

    // using lifecycle method to retrieve the data from the local storage while mounting
    componentDidMount(){
        const storedItems = localStorage.getItem('items');
        if (storedItems) {
            this.setState({
                items: JSON.parse(storedItems)
            });
        }
    }
    // updating  the localStorage whenver the items state change
    componentDidUpdate(prevProps,prevState){
        if (prevState.items !== this.state.items){
            localStorage.setItem('items',JSON.stringify(this.state.items));
        }
    }

    handleChange = event => {
        this.setState({
            input: event.target.value
        });
    };
    storeItems = event => {
        event.preventDefault();
        const { input } = this.state;

        if (input.trim()){
            this.setState({
                items: [...this.state.items, input],  //using spread operator to add input to items as a copy
                input: ""
            });
        }

        
 
    };

    deleteItem = key =>{

        //const allItems = this.state.items;

        // allItems.splice(key, 1)

        // this.setState({
        //     items: allItems
        // });          // this is a normal way of deleting now using highorder function
        this.setState({
            items: this.state.items.filter((data,index) => index !== key)
        });         // using higherorder function to delete data

    };

  render() {
    const { input,items } = this.state;
    // console.log(items);


    return (
      <div className='todo-container'>
         <div>
            <h1>TodoApp</h1>
        </div>
        
        <form className='input-section' onSubmit={this.storeItems}>
          
            <input type='text'
            value={input}
            onChange={this.handleChange}></input>
            <button className='add-bttn'> Add</button>
    
        </form>
        <ul className='item-list'>

            {items.map((data,index) =>(
                <li key = {index} > 
                    {data} 
                    <i className="fa-solid fa-trash-can" onClick={() => this.deleteItem(index)}></i>
                </li>                       //we pass the function as a call back function or it will be in a infinite loop
            ))}
        
        </ul>
        
      </div>
    )
  }
}
