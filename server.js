//Budget API
const exp = require('constants');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const categoryModel = require("./models/category_schema");
const app = express();
const port = 3000;
const uri = 'mongodb://127.0.0.1:27017/personal_budget';

app.use(cors());
app.use(express.json());

app.get('/budget', (req, res) => {
    getBudgetDataFromDB(res);
});

app.post('/category', (req, res) => {
    insertNewCategoryToDB(req.body, res);
});

async function getBudgetDataFromDB(response){
    await mongoose.connect(uri)
    .then(() => {
        categoryModel.find({})
        .then((data) => {
            let myBudget = {"myBudget": data};
            response.json(myBudget);
        })
    }).catch((error) => {
        console.log(error);
        res.status(400);
        response.json({error:"Error occurred while fulfilling the request."});
    });
}

async function insertNewCategoryToDB(inputJson, response){
    await mongoose.connect(uri)
    .then(() => {
        var model = new categoryModel(
            {
                title: inputJson.title, 
                budget: inputJson.budget, 
                color:inputJson.color
            });

        model.validate()
        .then(() =>{
                categoryModel.insertMany(model)
                .then((data) => {
                    console.log(data);
                    let myBudget = {"insertedObjects": data};
                    response.json(myBudget);
            })
            .catch((error) => {
                response.status(400);
                response.json({error:error, object: inputJson});
            });
        })
        .catch((ex) => {
            if (ex.name == 'ValidationError')
            {
                res.status(400);
                response.json({error: ex.message, object: inputJson});
            }
            else
            {
                res.status(400);
                response.json({error:"Error occurred while fulfilling the request.", object: inputJson});
            }
        });
    }).catch((error) => {
        res.status(400);
        response.json({error:"Error occurred while fulfilling the request.", object: inputJson});
    });
}

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
});