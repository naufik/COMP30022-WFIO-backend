import * as Express from 'express';
import * as File from 'graceful-fs';
import * as Path from 'path';
import * as HTTP from 'http';
import * as HTTPS from 'https';
import * as CORS from 'cors';
import * as Socket from 'socket.io';
import * as BodyParser from 'body-parser';
import UserRouter from './routes/user.router';
import MsgRouter from './routes/messaging.router';
import NotifRouter from './routes/notification.router';
import TwilioServer from './rtc/twilio';

const app: Express.Application = Express();
const credentials = {
    key: File.readFileSync(Path.join(__dirname, ".serverconfig", "privkey.pem"), "utf8"),
    cert: File.readFileSync(Path.join(__dirname, ".serverconfig", "certificate.pem"), "utf8"),
};

app.use(CORS());
app.use(BodyParser.json());

app.use('/user', UserRouter);
app.use('/msg', MsgRouter);
app.use('/notif', NotifRouter);
app.use('/voice', TwilioServer);

app.get('/', (req, res) => {
    console.log("received new request");
    res.json({
        server: "wfio",
        time: Date(),
        online: true,
        message: "Example response message",
    });
});



const server1 = HTTP.createServer(app).listen(80, () => {
    console.log("[http] HTTP Server Running");
});

const server2 = HTTP.createServer(app).listen(3000, () => {
    console.log("[http] Legacy 3000 Server Running");
});

const server3 = HTTPS.createServer(credentials, app).listen(443, () => {
    console.log("[http] HTTPS Server Running");
});

const io1 = Socket(server1);
const io2 = Socket(server2);
const io3 = Socket(server3);

[io1, io2, io3].map((thing) => {
    thing.on('connect', (socket: Socket.Socket) => {
        console.log("someone connected");
    });

    thing.on('disconnect', (socket: Socket.Socket) => {
        console.log("someone disconnected");
    });
})