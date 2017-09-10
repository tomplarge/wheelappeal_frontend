import {observable, autorun, action} from 'mobx';

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

export default class TruckStore {
  @observable truckData = [];
  @observable isLoading = true;
  @observable markers = [];

  constructor() {
    this.isLoading = true;
    this.loadTrucks()
  }

  // fetches trucks from database via call to API
  // loads these values into truckData and subsequently sets markers
  loadTrucks() {
    // fetch('http://wheelappeal.co:5000/truck_data', {
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // })
    // .then((response) => response.json()) // returns a promise
    //.then((responseJSON) => {this.constructTruckData(responseJSON); this.setMarkers()}) // JSON promise handled here
    trucks = [
      {
        truck_name: 'Truck',
        cuisine: 'Cuisine',
        truck_id: 't1',
        menu: [
          {
            item_id: 'i1',
            item_name: 'Item',
            item_price: 10
          },
          {
            item_id: 'i2',
            item_name: 'Item 2',
            item_price: 20
          }
        ]
      },
      {
        truck_name: 'Truck 2',
        cuisine: 'Cuisine 2',
        truck_id: 't2',
        menu: [
          {
            item_id: 'i3',
            item_name: 'Item',
            item_price: 10
          },
          {
            item_id: 'i4',
            item_name: 'Item 2',
            item_price: 20
          }
        ]
      }
    ];

    this.constructTruckData(trucks);
    this.setMarkers();
  }

  // constructs truckData objects
  // TODO create hash map for trucks
  @action constructTruckData = (responseJSON) => {
    this.truckData = responseJSON.map((truckData) => {
      return {
        truck_name: truckData.truck_name,
        key: truckData.truck_id,
        cuisine: truckData.cuisine,
        menu: this.constructMenu(truckData.menu)
      }
    });
  }

  // creates hash map for menu
  constructMenu = (menu) => {
    var tempMenu = new Map();
    menu.forEach((menuItem) => {
      tempMenu.set(menuItem.item_id,menuItem);
    })
    return tempMenu;
  }

  // sets markers for trucks
  //TODO: this is just setting random-ish locations. implement locations for truckdata
  @action setMarkers = () => {
    let index = 0;
    this.truckData.forEach((truck, truck_id) => {
      this.markers.push({
        key: truck_id,
        data: truck,
        index: index,
        coordinate: {
          latitude: LATITUDE + 0.01*index,
          longitude: LONGITUDE - 0.01*index,
        },
      });
      index++;
    });
  }
}

// export default class UserStore() {
//   @observable cart;
//   @observable favorites;
//
//   constructor() {
//
//   }
//
// }
// export class TodoStore {
//     authorStore;
//     transportLayer;
//     @observable todos = [];
//     @observable isLoading = true;
//
//     constructor(transportLayer, authorStore) {
//         this.authorStore = authorStore; // Store that can resolve authors for us
//         this.transportLayer = transportLayer; // Thing that can make server requests for us
//         this.transportLayer.onReceiveTodoUpdate(updatedTodo => this.updateTodoFromServer(updatedTodo));
//         this.loadTodos();
//     }
//
//     /**
//      * Fetches all todo's from the server
//      */
//     loadTodos() {
//         this.isLoading = true;
//         this.transportLayer.fetchTodos().then(fetchedTodos => {
//             fetchedTodos.forEach(json => this.updateTodoFromServer(json));
//             this.isLoading = false;
//         });
//     }
//
//     /**
//      * Update a todo with information from the server. Guarantees a todo
//      * only exists once. Might either construct a new todo, update an existing one,
//      * or remove an todo if it has been deleted on the server.
//      */
//     updateTodoFromServer(json) {
//         var todo = this.todos.find(todo => todo.id === json.id);
//         if (!todo) {
//             todo = new Todo(this, json.id);
//             this.todos.push(todo);
//         }
//         if (json.isDeleted) {
//             this.removeTodo(todo);
//         } else {
//             todo.updateFromJson(json);
//         }
//     }
//
//     /**
//      * Creates a fresh todo on the client and server
//      */
//     createTodo() {
//         var todo = new Todo(this);
//         this.todos.push(todo);
//         return todo;
//     }
//
//     /**
//      * A todo was somehow deleted, clean it from the client memory
//      */
//     removeTodo(todo) {
//         this.todos.splice(this.todos.indexOf(todo), 1);
//         todo.dispose();
//     }
// }
//
// export class Todo {
//
//     /**
//      * unique id of this todo, immutable.
//      */
//     id = null;
//
//     @observable completed = false;
//     @observable task = "";
//
//     /**
//      * reference to an Author object (from the authorStore)
//      */
//     @observable author = null;
//
//     store = null;
//
//     /**
//      * Indicates whether changes in this object
//      * should be submitted to the server
//      */
//     autoSave = true;
//
//     /**
//      * Disposer for the side effect that automatically
//      * stores this Todo, see @dispose.
//      */
//     saveHandler = null;
//
//     constructor(store, id=uuid.v4()) {
//         this.store = store;
//         this.id = id;
//
//         this.saveHandler = reaction(
//             // observe everything that is used in the JSON:
//             () => this.asJson,
//             // if autoSave is on, send json to server
//             (json) => {
//                 if (this.autoSave) {
//                     this.store.transportLayer.saveTodo(json);
//                 }
//             }
//         );
//     }
//
//     /**
//      * Remove this todo from the client and server
//      */
//     delete() {
//         this.store.transportLayer.deleteTodo(this.id);
//         this.store.removeTodo(this);
//     }
//
//     @computed get asJson() {
//         return {
//             id: this.id,
//             completed: this.completed,
//             task: this.task,
//             authorId: this.author ? this.author.id : null
//         };
//     }
//
//     /**
//      * Update this todo with information from the server
//      */
//     updateFromJson(json) {
//         // make sure our changes aren't send back to the server
//         this.autoSave = false;
//         this.completed = json.completed;
//         this.task = json.task;
//         this.author = this.store.authorStore.resolveAuthor(json.authorId);
//         this.autoSave = true;
//     }
//
//     dispose() {
//         // clean up the observer
//         this.saveHandler();
//     }
// }
