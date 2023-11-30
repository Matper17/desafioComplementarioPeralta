import mongoose from "mongoose";

const URI = 
"mongodb+srv://clientUser:coderhouse23@tiendavirtualcluster.j1fv3uh.mongodb.net/ecommerce?retryWrites=true&w=majority"; 

mongoose
.connect(URI)
.then(() => console.log("Connected to the DB"))
.catch((error) => console.log(error)); 