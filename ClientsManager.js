import AttributeContainer from "./Synchronizer/AttributesContainer.js";
import { Matrix4 } from "./Synchronizer/three/three.module.js";

export default class ClientsManager {
    #clientsMap = new Map();
    #clients = new AttributeContainer()
    #clientId = this.#clients.addAttribute("clientId");
    #clientSocket = this.#clients.addAttribute("clientSocket");
    #clientViewMatrix = this.#clients.addAttribute("clientViewMatrix");

    constructor ( ) {
        console.log(`ClientsManager - constructor`);

    }

    addClient ( clientId, socket ) {
        console.log(`ClientsManager - addClient (${clientId, socket})`);
        const client = this.#clients.newElement();
        this.#clients.ref(client);
        this.#clientId[client] = clientId;
        this.#clientSocket[client] = socket;
        this.#clientViewMatrix[client] = new Matrix4();

        this.#clientsMap.set(this.#clientId[client], client);
        console.log(this.#clientsMap)
        return client;
    }

    removeClient ( clientId ) {
        console.log(`ClientsManager - removeClient (${clientId})`);

        const client = this.getClient(clientId);
        this.#clientsMap.delete(this.#clientId[client]);
        this.#clients.unref(client); 
    }

    getClient ( clientId ) {
        return this.#clientsMap.get(clientId);
    }

    setClientViewMatrix ( clientId, viewMatrix ) {
        const client = this.getClient(clientId);
        this.#clientViewMatrix[client].copy(viewMatrix);
    }

	*#clientsIterator ( ) {
		for( const client of this.#clients.elements() ) {
			yield this.#clientId[client];
		}
	}

	*#clientsDataIterator ( ) {
		for( const client of this.#clients.elements() ) {
			yield {
				clientId: this.#clientId[client],
				socket: this.#clientSocket[client],
			};
		}
	}


	get clientIds ( ) {
		return [...this.#clientsIterator()];	
	}

	get clients ( ) {
		return [...this.#clientsDataIterator()];
	}

	getSocket ( clientId ) {
        const client = this.getClient(clientId);
		return this.#clientSocket[client]
	}
}