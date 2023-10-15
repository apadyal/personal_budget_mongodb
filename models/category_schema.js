const mongoose = require('mongoose');

function colorValidator(colorCodeString){
    if (colorCodeString.length >= 6)
    {
        if (colorCodeString[0] == '#')
        {
            return true;
        }
    }
    return false;
}

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        budget: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
            validate: [colorValidator, 'Color HEX value is not valid']
        }
    },{collection: 'myBudget'});

    module.exports = mongoose.model('myBudget', categorySchema);