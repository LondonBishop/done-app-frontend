class State {
    constructor() {
        this._users = [];
        this._selectedTask = null;
    }

    load(users){
        this._users = users;
    }

}