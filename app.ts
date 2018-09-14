import * as Express from 'express';
import * as File from 'graceful-fs';
import * as Path from 'path';
import * as HTTP from 'http';
import * as HTTPS from 'https';
import * as CORS from 'cors';
import * as BodyParser from 'body-parser';
import UserRouter from './routes/user.router';

const app: Express.Application = Express();
const credentials = {
    key: File.readFileSync(Path.join(__dirname, ".serverconfig", "privkey.pem"), "utf8"),
    cert: File.readFileSync(Path.join(__dirname, ".serverconfig", "certificate.pem"), "utf8"),
};

app.use(CORS());
app.use(BodyParser.json());

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

HTTP.createServer(app).listen(80, () => {
    console.log("[system] HTTP Server Running");
})

HTTPS.createServer(credentials, app).listen(443, () => {
    console.log("[system] HTTPS Server Running");
})