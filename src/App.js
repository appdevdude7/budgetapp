import React, { useState,useEffect } from 'react';

import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';

import uuid from 'uuid/v4';
const initialExpenses = localStorage.getItem('expenses')? JSON.parse(localStorage.getItem('expenses')) : [];
/* const initialExpenses = [
  {id:uuid(), charge : "rent", amount : 1600},
  {id:uuid(), charge : "Car", amount : 2500},
  {id:uuid(), charge : "internet", amount : 100}
];
 */
function App() {
  // ******state values*********
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense
  const [charge, setCharge] = useState('');
  // single Amount
  const [amount, setAmount] = useState('');
  // alert
  const [alert, setAlert] = useState ({show: false});
  // edit
  const [edit, setEdit] = useState (false);
  // edit item
  const [id, setId] = useState(0);
// ****** use Effect *********
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // ******functionality*********
  const handleCharge = e => {
    setCharge(e.target.value);
  }
  const handleAmount = e => {
    setAmount(e.target.value);
  }
  // handle alert
  const handleAlert = ({type, text}) => {
    setAlert({show: true, type, text});
    setTimeout(()=> {
      setAlert({show: false});
    },3000);
  }
  const handleSubmit = e => {
    e.preventDefault();
    if(charge !== "" && amount > 0 ) {
      if(edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? {...item, charge,amount} :item
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({type:'success', text: 'item Edited'});
      }
      else{
        const singleExpense = {id: uuid(), charge, amount};
        setExpenses([...expenses, singleExpense]);
        handleAlert({type:'success', text: 'item added'});
      }
      setCharge('');
      setAmount('');
    }
    else {
      // handle alert called
      handleAlert({type: 'danger', text: `charge can't be empty and amount has to be bigger than zero`});
    }
  };
  // clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({type: "danger", text: "All items deleted"});
  };
  // handle delete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item => item.id !== id );
    setExpenses(tempExpenses);
    handleAlert({type: "danger", text: "item deleted"});
  };
  // handle edit
  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id);
    let {charge, amount} = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };
  /* const result = useState(initialExpenses);
  const expenses = result[0];
  const setExpenses = result[1];
  console.log(expenses,setExpenses);
 */
  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm 
          charge={charge} 
          amount={amount} 
          handleAmount={handleAmount} 
          handleCharge={handleCharge}
          edit={edit}
          handleSubmit={handleSubmit} />
        <ExpenseList expenses={expenses} 
          handleDelete={handleDelete}
          clearItems={clearItems} 
          handleEdit={handleEdit}  />
      </main>
      <h1>
        Total Spending : <span className="total">
          ${expenses.reduce((acc, curr) => {
            return (acc+= parseInt(curr.amount));
          },0 )}
          </span>
      </h1>
    </>
  );
}

export default App;
