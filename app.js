// app.js

const express = require('express');
const bodyParser = require('body-parser');
const people = require('./data');

const app = express();
app.use(bodyParser.json());

let ticketCounter = 1;

// using Round Robin Principle
function assignTicketToPerson(ticket) {
  const person = people[ticketCounter % people.length];
  person.tickets.push(ticket);
  ticketCounter++;
  return person;
}

// Creating a new ticket
app.post('/tickets', (req, res) => {
    try{
        const { raisedby,issue } = req.body;
    if(!raisedby || !issue ){
        throw "Please provide both User ID and Issue";
    }
    const person = people.find(person => person.id === raisedby);
    if (!person) {
      throw "Invalid User ID. Person not found.";
    }
  const ticket = {
    id: ticketCounter,
    issue,
    assignedTo: assignTicketToPerson(ticketCounter).id,
    raisedby
  };
  ticketCounter++;
  person.tickets.push(ticket)
  res.status(200).json({
    success:"true",
    data :
    [{
        ticket_id:ticket.id,
        assigned_to:ticket.assignedTo
        }]
    })
}catch(err){
    console.log(err)
    res.status(500).json({
       message:err,
       success:"false",
       data:[{
       }]
    })
}
})
  

// Get all people with their tickets
app.get('/people', (req, res) => {
  res.json(people);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
