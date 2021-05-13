const express = require('express');
const app = express();

// connect MongoDB Atlas
const dbURI ='mongodb+srv://user_20210510:test_202105_8@practicenosql.oq6tw.mongodb.net/ejs-express-blog?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const Blog = require('./models/blog');
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/blogs');
});
app.get('/about', (req, res) => {
    res.render('about', { title: 'about' });
});
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a New Blog' });
});
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { title: 'Blog Details', blog: result });
        })
        .catch(err => {
            console.log(err);
        })
})
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(() => {
            res.json({ redirect: '/blogs' });
        })
        .catch(err => {
            console.log(err);
        })
})
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then(result => {
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch(err => {
            console.log(err);
        })
})
app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then(() => {
            res.redirect('/blogs');
        })
        .catch(err => {
            console.log(err);
        })
})
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});


// mongoose test below

// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'my chima blog3',
//         snippet: 'What is going on?',
//         body: 'foooooooooooooooooooooooooo'
//     })
//     blog.save()
//         .then(result => {
//             res.send(result);
//         })
//         .catch(err => {
//             console.log(err);
//         })
// });
// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//         .then(result => {
//             res.send(result);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });
// app.get('/single-blog', (req, res) => {
//     Blog.findById('609a7bbd850c1d124991da60')
//         .then(result => {
//             res.send(result);
//         })
//         .catch(err => {
//             console.log(err);
//         })
// });