import React, { Component } from 'react';
import './App.css';
import axios from './axios-baseUrl.js';
import Spinner from './components/Spinner/Spinner';

let i = 1;

class App extends Component {
  constructor() {
    super();
    this.state = {
      persons: [],
      addInput: '',
      updateInput: '',
      newPerson : {
        id: 1,
        name: '',
        completed: false,
        updateInput: ''
      }
    }
  }

  inputToAddPerson = (e) => {
    e.preventDefault();
    console.log(e.target.value);

  }

  componentDidMount() {
    console.log(this.state.persons);
    axios.get('/initial.json').then(res => {
      var aa = [];
      for(let key in res.data){
        i = res.data[key].id +1 || i;
        console.log('heyy, key', key);
        aa.push({
          ...res.data[key]
        })
      }
      this.setState({
        persons: aa
      });

      console.log(this.state.persons);
    }
  );
  }

  addPerson = (e, id) => {
    this.setState({
      addInput: e.target.value
    });
    const persons = this.state.persons;
    const person = persons.filter(p => p.id !== id);
    const newPerson = {
      id: id,
      name: e.target.value,
      completed: false,
      updateInput: ''
    }
    person.push(newPerson);
    this.setState({
      newPerson: newPerson,
      persons: person
    });
  }

  deleteHandler = (e, id) => {
    const persons = this.state.persons;
    const newPersonList = persons.filter(p => p.id !== id);
    let keyValue;
    axios.get('/initial.json').then(res => {
      for(let key in res.data){
        if(res.data[key].id == id){
          console.log(key);
          keyValue = key;
        }
      }
      console.log(keyValue);
      axios.delete(`/initial/${keyValue}.json`).then(res => console.log('hii', res));
    });
    this.setState({
      persons: newPersonList
    });
  }

  updatePerson = (e, id) => {
    let name = e.target.value;
    this.setState({
      updateInput: e.target.value
    });
    console.log(id);
    const persons = this.state.persons;
    const person = persons.filter(p => {
      if (p.id == id) {
        p.name = e.target.value
        p.updateInput = e.target.value
      }
      return p;
    });
    this.setState({
      persons: person
    });
    let keyValue;
    axios.get('/initial.json').then(res => {
      for(let key in res.data){
        if(res.data[key].id == id){
          console.log(key);
          keyValue = key;
        }
      }
      console.log(keyValue);
      axios.patch(`/initial/${keyValue}.json`, {
        name: name
     }).then(res => console.log('hii', res));
    });
  }

  updateHandler = (e, id) => {
    const persons = this.state.persons;
    const person = persons.filter(p => {
      if (p.id == id) {
        p.updateInput = ''
      }
      return p;
    });
    this.setState({
      persons: person
    });

  }

  addItem = () => {
    i++;
    this.setState({
      addInput: ''
    });
    const todo = {perosns: this.state.persons}
    if(this.state.newPerson.name!==''){
      axios.post('/initial.json', this.state.newPerson);
    }
  }
  checkComplete = (event, id) => {
    console.log('checked', id);
    const persons = this.state.persons;
    let keyValue;

          axios.get('/initial.json').then(res => {
            for(let key in res.data){
              if(res.data[key].id == id){
                console.log(key);
                keyValue = key;
              }
            }
            console.log(keyValue);
            var PersonChecked;
             persons.forEach(p => {
              if (p.id == id) {
                PersonChecked = p.completed
                return p.completed;
              }
            });
            axios.patch(`/initial/${keyValue}.json`, {
              completed: PersonChecked
           }).then(res => console.log('hii', res));
          });
          
    const person = persons.filter(p => {
      if (p.id == id) {
        p.completed = !p.completed
      }
      return p;
    });
    this.setState({
      persons: person
    });
    
  }
  render() {

    const persons = this.state.persons.length != 0? this.state.persons.map(person => {
      return (
        <div style= {{margin: 20}}>
          <li> {person.name} </li>
          <button type='Success' onClick={(event) => this.deleteHandler(event, person.id)}>Delete</button>
          <input onChange={(event) => this.updatePerson(event, person.id)} value={person.updateInput} />
          <button type='Success' onClick={(event) => this.updateHandler(event, person.id)}>Update</button>
          <input
                            type="checkbox"
                            value='box'
                            checked={person.completed}
                            onChange={(event) => this.checkComplete(event, person.id)}
                        />
        </div>
      )
    }) :<Spinner />

    return (
      <div className="App">
      <h3> Work ToDO </h3>
      < div style ={{margin: 30}}>
        <input onChange={(event) => this.addPerson(event, i)} value={this.state.addInput}/>
        <button onClick={this.addItem} > Add </button>
        </div>
        {persons}

      </div>
    );
  }
}

export default App;
