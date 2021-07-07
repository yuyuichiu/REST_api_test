const mongoose = require('mongoose')

// 0. Connect to our database
mongoose.connect('mongodb://localhost:27017/playground', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(console.log('Connected to MongoDB'))
    .catch(err => console.log(err.message))

// 1. schema
const courseSchema = new mongoose.Schema({
    _id: String,
    tag: [ String ],
    name: { type: String, required: true },
    author: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

// 2. Model
const Course = mongoose.model('Course', courseSchema, 'exercise')

// Exercise 3
async function getCourses() {
    try{
        const result = await Course.find({ isPublished: true})
            .or([ {price: { $gte: 15 }}, { name: /.*by.*/i } ])
            .sort('-price')
            .select({ name: 1, author: 1, price: 1, _id: 0 })

        console.log(result);
    } catch(err) {
        console.log('Error: ', err.message)
    }
}

// Update (update first)
async function updateCourse(id){
    try{
        const course = await Course.findByIdAndUpdate(id, {
            $set: {
                author: 'Jason',
                isPublished: false
            }
        }, { new: true })

        console.log(course)
    } catch(err) {
        console.log('Error: ', err.message)
    }
}
// updateCourse('5a68ff090c553064a218a547');

// Delete
async function deleteCourse(id){
    // course returns null if cannot find any item to delete
    const course = await Course.findByIdAndRemove(id);
    console.log(course)
}
deleteCourse('5a68ff090c553064a218a547');

// Update has 2 approaches:
// query first, update first
// Query first checks data before updating, check condition etc...
// Update first updates the data directly.












// Exercise 1
// async function getCourses() {
//     try{
//         let result = await Course.find({ isPublished: true, tags: 'backend' })
//             .select({name: 1, author: 1, _id: 0})
//             .sort({ name: 1 });

//         console.log(result)
//     } catch(err) {
//         console.log(err.message)
//     }
// }
// getCourses()

// Exercise 2
// async function getCourses() {
//     try{
//         const result = await Course.find({ isPublished: true, tags: {$in: ['frontend','backend']} })
//             .sort({ price: -1 })  // or '-price'
//             .select({ name: 1, author: 1, price: 1, _id: 0 })

//         console.log(result);
//     } catch(err) {
//         console.log('Error: ', err.message)
//     }
// }
// getCourses();

// Update (query first)
// async function updateCourse(id){
//     try{
//         const course = await Course.findOne({ _id: id });
        
//         if(!course) return;

//         course.isPublished = false;
//         course.author = 'Another Author';

//         const result = await course.save();
//     } catch(err) {
//         console.log('Error: ', err.message)
//     }
// }
// updateCourse('5a68ff090c553064a218a547');