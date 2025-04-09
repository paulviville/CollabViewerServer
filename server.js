// const WebSocket = require('ws');
import { WebSocketServer } from "ws";
import SceneDescriptor from "./Synchronizer/SceneDescriptor.js";

const server = new WebSocketServer({ port: 8080 });
/// Buffer : [Sender, Command, Data...]

const sceneDescriptor = new SceneDescriptor();


const clients = [];
const SERVER_ID = 0;

const NEW_PLAYER = 0
const REMOVE_PLAYER = 1

function newId() {
    return performance.now();
}

server.on('connection', (socket) => {
    const clientId = newId();
    
    const newPlayerBuffer = new Float32Array([SERVER_ID, NEW_PLAYER, clientId]);
    socket.send(newPlayerBuffer.buffer);
    for(const client in clients) {
        socket.send(new Float32Array([SERVER_ID, NEW_PLAYER, client]));
        clients[client].send(newPlayerBuffer.buffer);
    }
    clients[clientId] = socket;

    console.log(`New client connected. Id: ${clientId}`);
    
    // console.log(socket)
    // Handle incoming messages
    socket.on('message', (message) => {
        // console.log(`Received: ${message}`);
        
        // Broadcast the message to all connected clients
        server.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        delete clients[clientId]

        const removePlayerBuffer = new Float32Array([SERVER_ID, REMOVE_PLAYER, clientId]);
        for(const client in clients) {
            clients[client].send(removePlayerBuffer.buffer);
        }
    });
});

console.log('WebSocket server is running on ws://localhost:8080');

class Server {
	#port;
	#server;
	#clients = [];

	// #monitoringClient;

	constructor ( port = 8080 ) {
		this.#port = port;

		this.#initializeSocket();
	}

	#initializeSocket ( ) {
		this.#server = new WebSocketServer({ port: this.#port });


	}

	#onSocketConnection ( socket ) {

	}

	#onSocketClose ( ) {

	}

	#onClientMessage ( message ) {

	}


	#connectClient ( client ) {

	}

	#disconnectClient ( client ) {

	}

	#broadcastMessage ( message ) {

	}

	#sendMessage ( socket, message ) {

	}

}