import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({ message: "Server is Healthy" });
});

app.use("/v1", router);

app.listen("3000", () => {
  console.log('Server is running on port 3000');
})
