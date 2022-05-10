const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brx6v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

async function run() {
	try {
		await client.connect();
		const database = client.db('courierServices');
		const slideCollection = database.collection('slides');
		const productsCollection = database.collection('products');
		const announcementCollection = database.collection('announcements');
		const reportCollection = database.collection('reports');
		const userCollection = database.collection('user');

		// SLIDES GET API
		app.get('/slides', async (req, res) => {
			const cursor = slideCollection.find({}).sort({ "title" : -1 });
			const slides = await cursor.toArray();
			res.send(slides);
		});
		// SLIDES GET SINGEL API
		app.get('/slides/:id', async (req, res) => {
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const slide = await slideCollection.findOne(query);
			res.json(slide);
		});
		// SLIDES POST API
		app.post('/slides', async (req, res) => {
			const newSlides = req.body;
			const result = await slideCollection.insertOne(newSlides);
			res.json(result);
		});
		// SLIDES UPDATE API
		app.put('/slides/:id', async(req, res) => {
			const id= req.params.id;
			const updatedSlide = req.body;
			const filter = {_id:ObjectId(id)};
			const options = {upsert: true};
			const updateDoc ={
				$set: {
					title: updatedSlide.title,
					subTitle: updatedSlide.subTitle
				},
			};
			const result = await slideCollection.updateOne(filter, updateDoc, options);
			res.send(result);
		})
		// SLIDES DELETE API
		app.delete('/slides/:id', async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id)
			};
			const result = await slideCollection.deleteOne(query);
			res.json(result);
		})

		// PRODUCTS GET API
		app.get('/products', async (req, res) => {
			const cursor = productsCollection.find({}).sort({ icon : -1 });
			const products = await cursor.toArray();
			res.send(products);
		});
		// PRODUCTS GET SINGEL PRODUCT
		app.get('/products/:id', async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id)
			};
			const product = await productsCollection.findOne(query);
			res.json(product);
		});
		// PRODUCTS POST API
		app.post('/products', async (req, res) => {
			const newProducts = req.body;
			const result = await productsCollection.insertOne(newProducts);
			res.json(result);
		});
		// PRODUCTS UPDATE API
		app.put('/products/:id', async(req, res) => {
			const id= req.params.id;
			const updatedService = req.body;
			const filter = {_id:ObjectId(id)};
			const options = {upsert: true};
			const updateDoc ={
				$set: {
					title: updatedService.title,
					description: updatedService.description
				},
			};
			const result = await productsCollection.updateOne(filter, updateDoc, options);
			res.send(result);
		})
		// PRODUCTS DELETE API
		app.delete('/products/:id', async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id)
			};
			const result = await productsCollection.deleteOne(query);
			res.json(result);
		})

		// ANNOUNCEMENTS GET API
		app.get('/announcements', async (req, res) => {
			const cursor = announcementCollection.find({}).sort({ title : -1 });
			const announcements = await cursor.toArray();
			res.send(announcements);
		});
		// ANNOUNCEMENTS GET SINGEL API
		app.get('/announcements/:id', async (req, res) => {
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const announcement = await announcementCollection.findOne(query);
			res.json(announcement);
		});
		//ANNOUNCEMENTS POST API
		app.post('/announcements', async (req, res) => {
			const newAnnouncements = req.body;
			const result = await announcementCollection.insertOne(newAnnouncements);
			res.json(result);
		});
		// ANNOUNCEMENTS UPDATE API
		app.put('/announcements/:id', async(req, res) => {
			const id= req.params.id;
			const updatedAnnouncement = req.body;
			const filter = {_id:ObjectId(id)};
			const options = {upsert: true};
			const updateDoc ={
				$set: {
					title: updatedAnnouncement.title,
					description: updatedAnnouncement.description
				},
			};
			const result = await announcementCollection.updateOne(filter, updateDoc, options);
			res.send(result);
		})
		// ANNOUNCEMENTS DELETE API
		app.delete('/announcements/:id', async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id)
			};
			const result = await announcementCollection.deleteOne(query);
			res.json(result);
		})
		// REPORTS GET API
		app.get('/reports', async (req, res) => {
			const findReport = reportCollection.find({}).sort({ "time" : -1 });
			const reports = await findReport.toArray();
			res.send(reports);
		});
		// REPORTS POST API
		app.post('/reports', async (req, res) => {
			const newReports = req.body;
			const result = await reportCollection.insertOne(newReports);
			res.json(result);
		});
		// REPORTS DELETE API
		app.delete('/reports/:id', async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id)
			};
			const result = await reportCollection.deleteOne(query);
			res.json(result);
		})

/*// User get api
		app.get('/users/:email', async (req, res)=>{
			const email = req.params.email;
			const query = {email: email};
			const user = await userCollection.findOne(query);
			let isAdmin = false;
			if(user?.role === 'admin'){
				isAdmin = true;
			}
			res.json({admin: isAdmin});
		})
		// Firebase to database save data post api
		app.post('/users', async (req, res)=>{
			const newUser = req.body;
			const result = await userCollection.insertOne(newUser);
			res.json(result);
		});
	
		// Make Admin
		app.put('/users/admin', async(req, res) =>{
			const users = req.body;
					const filter = {email: users.email};
					const updateDoc = {$set: {role: 'admin'}};
					const result = await userCollection.updateOne(filter, updateDoc);
					res.json(result);
		})*/


		// GET - All users
    app.get("/user", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
    });

    // POST - Save user info to user collection
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      console.log(result);
      res.json(result);
    });

    // PUT - Update user data to database for third party login system
    app.put("/user", async (req, res) => {
      const user = req.body;
      console.log("put", user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // Delete - Delete an user from DB
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.json({ _id: id, deletedCount: result.deletedCount });
    });

    // GET - Admin Status.
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      let isAdmin = false;
      if (result?.role === "admin") {
        isAdmin = true;
        res.json({ admin: isAdmin });
      } else {
        res.json({ admin: isAdmin });
      }
    });

    // PUT - Set an user role as admin
    app.put("/make-admin/:id", async (req, res) => {
      const filter = req.params.id;
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(
        { email: filter },
        updateDoc
      );
      res.json(result);
      console.log(result);
    });

    // Get api admin
    app.get("/admins", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
    });

    // PUT - Set an user role as admin
    app.put('/user/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('runniing my curd server')
});
app.listen(port, () => {
	console.log('running server on port', port);
});