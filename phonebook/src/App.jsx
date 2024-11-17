import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const PersonForm = ({onSubmit, nameValue, onNameChange, numberValue, onNumberChange}) => {
  return (
    <form onSubmit={onSubmit}>
    <div>
    name: <input value={nameValue} onChange={onNameChange}/>
    number: <input value={numberValue} onChange={onNumberChange}/>
    </div>
    <div>
    <button type="submit">add</button>
    </div>
    </form>
  )
}

const Persons = ({persons, onSubmit, onIdToDeleteChange}) => {
  return (
    <div>
    {persons.map(person =>
<form onSubmit={onSubmit} key={person.id}>
<div>
{person.name} {person.number}
<button type="submit" value={person.id} onClick={onIdToDeleteChange}>delete</button>
</div>
</form>
)}
    </div>
  )
}

const Filter = ({value, onChange}) => {
  return (
    <div>
    filter shown with 
    <input value={value} onChange={onChange}/>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [idToDelete, setIdToDelete] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)


useEffect(() => {
axios
.get('http://localhost:3001/persons')
.then(response => {
setPersons(response.data)
})
}, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    const personList = persons.filter(person => person.name === newName)
    if (personList.length > 0) {
      if (confirm(`${newName} already exists, replace with new number?`)) {
        const updatedPerson= {...personList[0], number: newNumber}
        personsService
        .update(updatedPerson.id, updatedPerson)
        .then(response => {
        setPersons(persons.map(person => person.name === newName? updatedPerson : person))
        addNotification('update')
        })
        .catch(error => {
          setNotificationMessage(`Info of ${updatedPerson.name} is already deleted`)
        })
        
        return
      } else {return }
    }
    personsService
    .create({name: newName, number: newNumber})
    .then(response => {
    setPersons(persons.concat(response))
    })
    addNotification('add')
  }

  const deletePerson = (event) => {
    const personToDelete = persons.filter(person => person.id === idToDelete)[0]
    if (!confirm(`delete ${personToDelete.name}?`))
      return
    
    personsService
    .remove(idToDelete)
    .then(response => {
    setPersons(persons.filter(person => person.id !== idToDelete))
    })
  }
  const personsToShow = (persons) => filter !== '' ? persons.filter(person => person.name.toUpperCase().includes(filter.toUpperCase())) : persons;

  const addNotification = action => {
    if (action === 'add') {
      setNotificationMessage(`Added ${newName}`)
    } else {
      setNotificationMessage(`Updated ${newName}`)
    }
    setTimeout(() => {
      setNotificationMessage(null)
    }, 500)
  }
  return (
    <div>
      <Notification message={notificationMessage} />
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange}/>
      <PersonForm onSubmit={addNewPerson} onNameChange={handleNameChange} nameValue={newName} onNumberChange={handleNumberChange} numberValue={newNumber}/>
      <h2>Numbers</h2>
      <Persons persons={personsToShow(persons)} onSubmit={deletePerson} onIdToDeleteChange={(event) => setIdToDelete(event.target.value)}/>
    </div>
  )
}

export default App
