const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  // If edit sub-document, we must update through the main document as if editing object
  const course = await Course.findById(courseId);
  // update as if an object inside object
  course.author.name = 'Billy Herrington';
  course.save();
  console.log(course);
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);

  course.authors.push(author);
  course.save();
  console.log(course);
}

// createCourse('Node Course', new Author({ name: 'Mosh' }));

// updateAuthor('60e965ae51a671a0b8785be8')

addAuthor('60e98cf5d7de99621cf3ade3', new Author({ name: 'Amy' }))