import express, { Router } from 'express';

const app = express();
const port = 3000;

const router = express.Router();
app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]${req.method} ${req.url}`);
    next();
})

let cars = [
    {id: 1, make: 'Toyota', model: 'Camry', year: 2020, price: 234000},
    {id: 2, make: 'Honda', model: 'Civic', year: 2019, price: 454000},
    {id: 3, make: 'Ford', model: 'Mustang', year: 2021, price: 764000},
];  

app.get('/', (req, res) => {
    res.send("Hello from the cars API");
})

// GET all cars
router.get('/', (req, res) => {
    res.json(cars);
})

// GET single car by id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const car = cars.find(car => car.id === id);

    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
})

// POST - Add new car
router.post('/', (req, res) => {
    const { make, model, year, price } = req.body;
    
    if (!make || !model || !year || !price) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const newCar = {
        id: cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1,
        make,
        model,
        year,
        price
    };
    
    cars.push(newCar);
    res.status(201).json(newCar);
})

// PUT - Update existing car
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { make, model, year, price } = req.body;
    
    const carIndex = cars.findIndex(car => car.id === id);
    
    if (carIndex === -1) {
        return res.status(404).json({ error: "Car not found" });
    }
    
    // Update only provided fields
    cars[carIndex] = {
        ...cars[carIndex],
        ...(make && { make }),
        ...(model && { model }),
        ...(year && { year }),
        ...(price && { price })
    };
    
    res.json(cars[carIndex]);
})

// DELETE - Remove car
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const carIndex = cars.findIndex(car => car.id === id);
    
    if (carIndex === -1) {
        return res.status(404).json({ error: "Car not found" });
    }
    
    const deletedCar = cars.splice(carIndex, 1);
    res.json({ message: `Car with id ${id} has been deleted`, deletedCar: deletedCar[0] });
})

// Mount the router
app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})