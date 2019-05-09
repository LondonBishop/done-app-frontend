const objState = new State;


function init() {
  
  ServerApi.getAllUsers()
    .then(users => {
        objState.load(users);
        TaskController.loadPage(objState);
     });
}

// start up app.
init()

