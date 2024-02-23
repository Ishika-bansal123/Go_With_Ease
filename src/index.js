const express = require("express") ;
const app= express();
const path = require("path");
const ejs = require("ejs");
const { TicketModel,TicketResponse}  =require("./mongodb");
const axios = require("axios");
const flatted = require('flatted');


const tempelatePath=path.join(__dirname,'../tempelates');
app.use(express.json());
app.set("view engine", "ejs");
app.set("views",tempelatePath);
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, '../public')));

app.get("/last", (req,res)=>{
    res.render("last")
})

app.post("/ticket",async(req,res)=>{
    const data = {
        boarding_station: req.body.boarding_station,
        destination_station: req.body.destination_station,
        train_number: req.body.train_number,
        date: req.body.date,
        gmail: req.body.gmail,
        quota: req.body.quota,
        classType: req.body.classType  
    };

    await TicketModel.insertMany([data]);

    res.render("last");
})

// app.post("/ticket_details",async(req,res)=>{
//     const response = await TicketModel.find({})
//     console.log(response);
//     try{

//         for(const item of response){
//           console.log("item of a response is",item);
//           const options = {
//             method: 'GET',
//             url: 'https://irctc1.p.rapidapi.com/api/v1/checkSeatAvailability',
//             params: {
//               classType: item.classType,
//               fromStationCode: item.boarding_station,
//               quota: item.quota,
//               toStationCode: item.destination_station,
//               trainNo: item.train_number,
//               date: item.date.toString().slice(0,10),
//             },
//             headers: {
//               'X-RapidAPI-Key': 'd409e3c2a6msh2561f0116eb817fp135f80jsn965fa50a6d3e',
//               'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
//             }
//           };
          
//           console.log("options for API",options);
//           const result = await axios.request(options);
//           console.log("response of a single mongo doc => ", result.data);
//           const result2 = await TicketResponse.create({
//             data:result,
//             ticketId: item._id,
//           })
         
//           console.log("result2 is",result2);
//           return res.status(200).send({
//             success:true,
//             data:{result,result2}
//           });
//         }
//       }
//       catch(err){
//         console.error(err);
//         return res.status(500).send({
//           success:false,
//           error:err
//         })
//       }
// })


app.post("/ticket_details", async (req, res) => {
  try {
      const response = await TicketModel.find({});
      console.log(response);

      const results = [];

      for (const item of response) {
          const options = {
              method: 'GET',
              url: 'https://irctc1.p.rapidapi.com/api/v1/checkSeatAvailability',
              params: {
                  classType: item.classType,
                  fromStationCode: item.boarding_station,
                  quota: item.quota,
                  toStationCode: item.destination_station,
                  trainNo: item.train_number,
                  date: item.date.toString().slice(0, 10),
              },
              headers: {
                  'X-RapidAPI-Key': 'd409e3c2a6msh2561f0116eb817fp135f80jsn965fa50a6d3e',
                  'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
              }
          };

          const result = await axios.request(options);
          const result2 = await TicketResponse.create({
              data: result.data,
              ticketId: item._id,
          });

          console.log("result2 is", result2);
          results.push({ result, result2 });
      }
      const jsonString = flatted.stringify(results);
      return res.status(200).send(jsonString);
      // return res.status(200).send({
      //     success: true,
      //     data: results
      // });
  } catch (err) {
      console.error(err);
      return res.status(500).send({
          success: false,
          error: err
      });
  }
});
app.listen(3000,()=>{
    console.log("port connected");
})