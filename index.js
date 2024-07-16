import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/myLoginRegister", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

//schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

//model
const User = new mongoose.model("User", userSchema);

//routes
app.get("/", (req, res) => {
  res.send("my api");
});

app.post("/Login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({email: email}, (err, user) =>{
        if(user){
            if(password === user.password){
                res.send({message: "Login successfull! ", user: user})
            }
            else{
                res.send({message: "password wrong!"})
            }
        }else{
            res.send({message: "user not registerd!"})
        }
    })
});

app.post("/Register", (req, res) => {
  // console.log(req.body)
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "user already registerd!" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully registered!" });
        }
      });
    }
  });
});

app.listen(9002, () => {
  console.log("be started at port 9002");
});
