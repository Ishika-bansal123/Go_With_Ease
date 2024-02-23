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
//   gmail:String,
//   quota: String,
//   classType: String
// });

// const TicketModel = mongoose.model('Ticket', TicketSchema);

// app.use(bodyParser.json());

// app.get("/last",(req,res)=>{
//     res.render("last");
// })
// // Route to fetch information from the database and check seat availability using the API
// app.post('/checkSeatAvailability', async (req, res) => {
//   try {
//     const requestData = req.body; // Assuming the request body contains necessary data

//     // Validate the request data (add your validation logic here if needed)
//     if (!requestData.trainNumber || !requestData.date) {
//       return res.status(400).json({ error: 'Invalid request data' });
//     }

//     // Replace with the actual data format expected by the API
//     const apiRequestData = {
//       trainNumber: requestData.trainNumber,
//       date: requestData.date.toISOString().split('T')[0], // Assuming the API expects the date in YYYY-MM-DD format
//       // Add other required parameters based on the API documentation
//     };

//     // Replace with your API key and host
//     const apiKey = 'd409e3c2a6msh2561f0116eb817fp135f80jsn965fa50a6d3e';
//     const apiUrl = 'https://irctc1.p.rapidapi.com/api/v1/checkSeatAvailability';

//     const response = await axios.post(apiUrl, apiRequestData, {
//       headers: {
//         'X-RapidAPI-Key': apiKey,
//         // Add other required headers based on the API documentation
//       },
//     });

//     // Handle the response from the API as needed
//     const seatAvailabilityData = response.data;
//     res.json(seatAvailabilityData);
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

