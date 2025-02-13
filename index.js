import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import routes from "./routes/index.js";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to db...");
  })
  .catch((err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get('/',(req, res) =>{
  res.send('WELCOME!')
})



// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'API Documentation',
      description: 'API documentation for my project',
      version: '1.0.0',
      contact: {
        name: 'Silver Seeker',
        email: 'filalliance769@gmail.com',
      },
    },
    servers:"http:localhost:8082",
    basePath: '/', // base path for your API
  },
  apis: ['./routes/*.js'], // Path to your API routes or controllers
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.listen(PORT, (err) => {
  if (err) throw new Error(err);
  console.log(`Server running on port ${PORT}`);
});
