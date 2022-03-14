require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
//mongoose.connect('mongodb+srv://hamiltonlumati:ICUI4CU10h!@cluster0.p4cp2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const personSchema = new Schema({
    name: { type: String, required: true },
    age: Number,
    favoriteFoods: [String]
});
const Person = mongoose.model("Person", personSchema);

var createAndSavePerson = function(done) {
    var janeFonda = new Person({ name: "Jane Fonda", age: 84, favoriteFoods: ["eggs", "fish", "fresh fruit"] });

    janeFonda.save(function(err, data) {
        if (err) return console.error(err);
        done(null, data)
    });
};


var arrayOfPeople = [
    { name: "Frankie", age: 74, favoriteFoods: ["Del Taco"] },
    { name: "Sol", age: 76, favoriteFoods: ["roast chicken"] },
    { name: "Robert", age: 78, favoriteFoods: ["wine"] }
];

var createManyPeople = function(arrayOfPeople, done) {
    Person.create(arrayOfPeople, function(err, people) {
        if (err) return console.log(err);
        done(null, people);
    });
};

var findPeopleByName = function(personName, done) {
    Person.find({ name: personName }, function(err, personFound) {
        if (err) return console.log(err);
        done(null, personFound);
    });
};


const findOneByFood = (food, done) => {
    Person.findOne({ favoriteFoods: food }, function(err, foodFound) {
        if (err) return console.log(err);
        done(null, foodFound);
    })
};

const findPersonById = (personId, done) => {
    Person.findOne({ _id: personId }, function(err, foodFound) {
        if (err) return console.log(err);
        done(null, foodFound);
    })
};

const findEditThenSave = (personId, done) => {
    const foodToAdd = 'hamburger';

    // .findById() method to find a person by _id with the parameter personId as search key. 
    Person.findById(personId, (err, result) => {
        if (err) {
            return console.log(err);
        } else {
            result.favoriteFoods.push(foodToAdd);
            result.save((err, updatedPerson) => {
                if (err) {
                    console.log(err)
                } else {
                    done(null, updatedPerson)
                }
            })
        }
    })
};

const findAndUpdate = (personName, done) => {
    const ageToSet = 20;
    Person.findOneAndUpdate({ name: personName }, { age: ageToSet }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                done(null, result)
            }
        })
        //done(null /*, data*/ );
}

const removeById = (personId, done) => {
    Person.findOneAndDelete({ _id: personId }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                done(null, result)
            }
        })
        //done(null /*, data*/ );
};

/* const removeManyPeople = (done) => {
    const nameToRemove = "Mary";
    Person.deleteMany({ name: nameToRemove }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            done(null, result);
        }
    })

}; */

const queryChain = (done) => {
    const foodToSearch = "burrito";
    Person.find({ favoriteFoods: foodToSearch })
        .sort({ name: 1 })
        .limit(2)
        .select({ age: 0 })
        .exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                done(null, result);
            }
        });

    //done(null /*, data*/ );
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
//exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;