const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())



// username :dbjohnn1
// password:tx6kerv7KsEGK6Nz

const uri = "mongodb+srv://dbjohnn1:tx6kerv7KsEGK6Nz@cluster0.scnnn8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const productCollection  = client.db('emajohnsimple').collection('product')
    const orderCollection  = client.db('emajohnsimple').collection('order')
    const userCollection  = client.db('emajohnsimple').collection('user')
// /////data mongo thaka load korae\\\\\\\\\\\\\
app.get('/product',async(req,res) => {
    const query = {};
    const cursor = productCollection.find(query)
    const product = await cursor.toArray();
    res.send(product)
})

        // /////Post Data\\\\\\\\\\\
        app.post('/product',async(req,res)=> {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

       /////// // Product Delete\\\\\\\\\\\\\\
       app.delete('/product/:id',async(req,res) => {
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const result = await productCollection.deleteOne(query)
        res.send(result)
       })

// ///////////order guli mongotae post korae
app.post('/order',async(req,res)=> {
     const neworder = req.body;
     const result = await orderCollection.insertOne(neworder)
     res.send(result)
})
// /////////////order guli mail id diea filter korae dakhano\\\\\\\\\\\\\\\\
app.get('/order',async(req,res) => {
    const email = req.query.email;
    const query = {email:email}
    const cursor = orderCollection.find(query);
    const product = await cursor.toArray();
    res.send(product)
})
// ////////order delete\\\\\\\\\\\\\
app.delete('/order/:id',async(req,res) => {
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const result = await orderCollection.deleteOne(query)
    res.send(result)
})

///jodi user naa thakae to add hobae ar thaklae update hoiii\\\\\\\\\\\\\\

app.put('/user/:email',async(req,res) => {
  const email = req.params.email;
  console.log(email)
  const user = req.body;
  const filter = {email: email};
  const options = {upsert : true}
  const updateDoc = {
    $set: user,  
  };
  const result = await userCollection.updateOne(filter,updateDoc,options);
  res.send({result })

})

// /////user mongo thaka load korae\\\\\\\\\\\\\
app.get('/user',async(req,res) => {
  const query = {};
  const cursor = userCollection.find(query)
  const product = await cursor.toArray();
  res.send(product)
})

  //////////user delete\\\\\\\\
  app.delete('/user/:id',async(req,res) => {
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const result = await userCollection.deleteOne(query)
    res.send(result)

  })

   // //////////admin banano \\\\\\\\\\\\\\\\

   app.put('/user/admin/:email',async(req,res) => {
    const email = req.params.email;
    const requester = req.params.email;
    
    const requesteraccount = await userCollection.findOne({email:requester})
   
    // if(requesteraccount.role == 'admin'){
      // console.log(requesteraccount)
      
      const filter = {email: email};
      // console.log(filter)
      const updateDoc = {
        $set: {role:'admin'},
      };
      const result = await userCollection.updateOne(filter,updateDoc);
      res.send(result )
  })
//  //////admin na holae dahtae dabo naaaa\\\\\\\\\\\\\\
  app.get('/admin/:email',async(req,res) => {
    const email = req.params.email;
    const user= await userCollection.findOne({email:email});
    console.log(user)
    const isAdmin = user.role === 'admin';
    res.send({admin: isAdmin})
  })



  } catch(error) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})