// const express = require('express');
// const mongoose = require('mongoose');
// const path = require("path");
// const ejs = require("ejs");
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const tempelatePath=path.join(__dirname,'../tempelates');

// const app = express();
// const port = 3000;
// app.use(express.json());
// app.set("view engine", "ejs");
// app.set("views",tempelatePath);
// app.use(express.urlencoded({extended:false}));
// app.use(express.static(path.join(__dirname, '../public')));

// // Replace with your MongoDB connection string
// mongoose.connect('mongodb://127.0.0.1:27017/trainTickets', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

// // Replace with your MongoDB schema and model
// const TicketSchema = new mongoose.Schema({
//   boarding_station: String,
//   destination_station: String,
//   train_number: String,
//   date: Date,
//   gmail: String,
//   quota: String,
//   classType: String
// });

// const TicketModel = mongoose.model('Ticket', TicketSchema);

// app.use(bodyParser.json());

// // Route to display the form
// app.get('/last', (req, res) => {
//   res.render('last'); // Assuming you have a "last.ejs" template
// });

// // Route to handle form submission and API request
// app.post('/checkSeatAvailability', async (req, res) => {
//   try {
//     const formData = req.body;

//     // Validate form data
//     if (!formData.train_number || !formData.date) {
//       return res.status(400).json({ error: 'Invalid request data' });
//     }

//     // Save user details to MongoDB
//     const newTicket = new TicketModel({
//       boarding_station: formData.boarding_station,
//       destination_station: formData.destination_station,
//       train_number: formData.train_number,
//       date: formData.date,
//       gmail: formData.gmail,
//       quota: formData.quota,
//       classType: formData.classType
//     });

//     const savedTicket = await newTicket.save();

//     // Call seat availability API
//     const apiRequestData = {
//       trainNumber: formData.train_number,
//       date: formData.date.toISOString().split('T')[0],
//       // Add other required parameters based on API documentation
//     };

//     const apiKey = 'd409e3c2a6msh2561f0116eb817fp135f80jsn965fa50a6d3e';
//     const apiUrl = 'https://irctc1.p.rapidapi.com/api/v1/checkSeatAvailability';

//     const apiResponse = await axios.post(apiUrl, apiRequestData, {
//       headers: {
//         'X-RapidAPI-Key': apiKey
//         // Add other required headers based on API documentation
//       }
//     });

//     const seatAvailabilityData = apiResponse.data;

//     // Display results or send them back to the client
//     res.json({ savedTicket, seatAvailabilityData });
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
