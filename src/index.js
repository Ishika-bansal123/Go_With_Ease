const express = require("express");
const app= express();
const path = require("path");
const ejs = require("ejs");
const { TicketModel,TicketResponse}  =require("./mongodb");
const axios = require("axios");

const flatted = require('flatted');
const mailSender = require('./utils/mailSender')
const cron = require('node-cron');
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

    try{
        const options = {
            method: 'GET',
            url: 'https://irctc1.p.rapidapi.com/api/v1/checkSeatAvailability',
            params: {
                classType: req.body.classType,
                fromStationCode: req.body.boarding_station,
                quota: req.body.quota,
                toStationCode: req.body.destination_station,
                trainNo: parseInt(req.body.train_number),
                date: req.body.date.toString().slice(0, 10),
            },
            headers: {
                'X-RapidAPI-Key': 'd409e3c2a6msh2561f0116eb817fp135f80jsn965fa50a6d3e',
                'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
            }
        };

        const result = await axios.request(options);

        let flag = false;
        for(const item of result.data){
            if(item.date.toString().slice(0, 2) == req.body.date.toString().slice(0, 2)){
                if(item.current_status.toString().includes("AVAILABLE")){
                    flag = true;

                    try{
                        const mailResponse = await mailSender(req.body.gmail,
                            "Tickets Info",
                            `
                                ${parseInt(item.current_status.toString().split('-')[1])} Tickets are available for date - ${item.date.toString()}
                            `
                            );
                        console.log("Email sended Successfully!! => ", mailResponse);
                    } 
                    catch(error) {
                        console.log("error while SENDING.. EMAIL", error);
                        return res.status(500).send({
                            success: false,
                            message: "Error while SENDING.. EMAIL"
                        });
                    }
                }
            }
        }

        if(flag == false){
            try{
                const mailResponse = await mailSender(req.body.gmail,
                    "Tickets Info",
                    `
                        Sorry, no Tickets are available for date - ${item.date.toString()}
                    `
                    );
                console.log("Email sended Successfully!! => ", mailResponse);
            } 
            catch(error) {
                console.log("error while SENDING.. EMAIL", error);
                return res.status(500).send({
                    success: false,
                    message: "Error while SENDING.. EMAIL"
                });
            }
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).send({
            success: false,
            error: err,
            message: "Error while hitting API"
        });
    }

    res.render("last");
})



const ticketDetails = async (req, res) => {
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

            let flag = false;

            for(const item of result.data){
                if(item.date.toString().slice(0, 2) == req.body.date.toString().slice(0, 2)){
                    if(item.current_status.toString().includes("AVAILABLE")){
                        flag = true;
                        let message = "No";
                        let range = parseInt(item.current_status.toString().split('-')[1])

                        if(range >= 10 && range <= 20){
                            message = "10 to 20"
                        }
                        else if(range >= 1 && range <= 10){
                            message = "1 to 10"
                        }
                        else if(range >= 20 && range <= 30){
                            message = "20 to 30"
                        }
                        
                        try{
                            const mailResponse = await mailSender(req.body.gmail,
                                "Tickets Info",
                                `
                                    ${message} Tickets are available for date - ${item.date.toString()}
                                `
                                );
                            console.log("Email sended Successfully!! => ", mailResponse);
                        } 
                        catch(error) {
                            console.log("error while SENDING.. EMAIL", error);
                            return res.status(500).send({
                                success: false,
                                message: "Error while SENDING.. EMAIL"
                            });
                        }
                    }
                }
            }

            if(flag == false){
                try{
                    const mailResponse = await mailSender(req.body.gmail,
                        "Tickets Info",
                        `
                            Sorry, no Tickets are available for date - ${item.date.toString()}
                        `
                        );
                    console.log("Email sended Successfully!! => ", mailResponse);
                } 
                catch(error) {
                    console.log("error while SENDING.. EMAIL", error);
                    return res.status(500).send({
                        success: false,
                        message: "Error while SENDING.. EMAIL"
                    });
                }
            }
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
}

app.post("/ticket_details", ticketDetails);

// Schedule the task to run every 24 hours
cron.schedule('0 0 */24 * * *', () => {
    console.log('Scheduled task running...');
    ticketDetails(); // Call the function to hit the API
});

app.listen(3000,()=>{
    console.log("port connected");
})