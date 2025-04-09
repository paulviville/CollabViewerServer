import AttributeContainer from "./Synchronizer/AttributesContainer.js";
import { Matrix4 } from "./Synchronizer/three/three.module.js";

export default class ClientsManager {
    #clientsMap = new Map();
    #clients = new AttributeContainer()
    #clientId = this.#clients.addAttribute("clientId");
    #clientViewMatrix = this.#clients.addAttribute("clientViewMatrix");
    // #clientSocket = this.#clients.addAttribute("clientSocket");

    constructor ( ) {
        console.log(`ClientsManager - constructor`);

    }

    addClient ( clientId ) {
        console.log(`ClientsManager - addClient (${clientId})`);
        const client = this.#clients.newElement();
        this.#clients.ref(client);
        this.#clientId[client] = clientId;
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
}