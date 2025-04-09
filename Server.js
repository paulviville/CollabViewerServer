import SceneDescriptor from "./Synchronizer/SceneDescriptor.js";
import ClientsManager from "./ClientsManager.js";
import { WebSocketServer, WebSocket } from "ws";

/// Buffer : [Sender, Command, Data...]


const clients = [];
const SERVER_ID = 0;



const NEW_PLAYER = 0;
const REMOVE_PLAYER = 1;
const SET_PLAYER = 2;

export default class Server {
	#port;
	#server;
	#clients = [];
    #clientsManager = new ClientsManager();
    #sceneDescriptor = new SceneDescriptor();
	// #monitoringClient;

	constructor ( port = 8080 ) {
        console.log(`Server - constructor (${port})`);
		this.#port = port;

		this.#initializeSocket();
	}

	#initializeSocket ( ) {
		this.#server = new WebSocketServer({ port: this.#port });

        this.#server.on('connection', ( socket ) => {
            this.#onSocketConnection(socket);
        });
	}

	#onSocketConnection ( socket ) {
        console.log(`Server - #onSocketConnection`);

        const clientId = this.#connectClient(socket);
        this.#clientsManager.addClient(clientId);
        
        socket.on('message', ( message ) => {
            this.#onClientMessage(socket, message);
        });
    
        socket.on('close', ( ) => {
            this.#onSocketClose(clientId);
        });
	}

	#onSocketClose ( clientId ) {
        console.log(`Server - #onSocketClose (${clientId})`);
        delete this.#clients[clientId]

        const removePlayerBuffer = new Float32Array([SERVER_ID, REMOVE_PLAYER, clientId]);
        for(const client in this.#clients) {
            console.log(client);
            this.#clients[client].send(removePlayerBuffer.buffer);
        }
        
        this.#clientsManager.removeClient(clientId);
	}

	#onClientMessage ( socket, message ) {
        this.#server.clients.forEach(( client ) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) { 
                client.send(message);
            }
        });
	}


	#connectClient ( socket ) {
        console.log(`Server - #connectClient`);

        const clientId = this.#newId();
        // console.log(`New client connected. Id: ${clientId}`);
    
        const newPlayerBuffer = new Float32Array([SERVER_ID, NEW_PLAYER, clientId]);
        const setPlayerBuffer = new Float32Array([SERVER_ID, SET_PLAYER, clientId]);

        socket.send(newPlayerBuffer.buffer);
        for(const client in this.#clients) {
            console.log(client)
            socket.send(new Float32Array([SERVER_ID, NEW_PLAYER, client]));
            this.#clients[client].send(newPlayerBuffer.buffer);
        }
        this.#clients[clientId] = socket;

        return clientId;
	}

	#disconnectClient ( client ) {

	}

	#broadcastMessage ( message ) {

	}

	#sendMessage ( socket, message ) {
        // socket
	}

    #newId ( ) {
        return performance.now();
    }
}