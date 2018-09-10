import * as Express from 'express';
import * as CORS from 'cors';
import * as BodyParser from 'body-parser';
import UserRouter from './routes/user.router';

const app: Express.Application = Express();

app.use(CORS());
app.use(BodyParser.json());

app.listen(3000, () => {
    console.log("TEAM WE'LL FIGURE IT OUT");
    console.log("APPLICATION BACKEND");
    console.log("########################");
    console.log("RUNNING REVISION 1.0");
});

app.use('/user', UserRouter);
app.get('/', (req, res) => {
    console.log("received new request");
    res.json({
        server: "wfio",
        time: Date(),
        online: true,
        message: "Example response message",
    });
});
