const http = require('http');
const WebSocket = require('ws');

const port = 80;
const server = http.createServer((req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/plain"
	});
	res.end("WebSocket server is working.");
});

const wss = new WebSocket.Server({
	server
});
const connections = {};

wss.on("connection", (ws, req) => {
	const code = req.url.slice(1);
	if (!connections[code]) {
		connections[code] = [ws];
	} else {
		connections[code].push(ws);
	}
	ws.on("message", (message) => {
		connections[code].forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message.toString());
				//console.log(message.toString());
			}
		});
	});
	ws.on("close", () => {
		const index = connections[code].indexOf(ws);
		if (index > -1) {
			connections[code].splice(index, 1);
			if (connections[code].length === 0) {
				delete connections[code];
			}
		}
	});
});

server.listen(port, () => {
	console.log(`Server is listening on port ${port}.`);
});
