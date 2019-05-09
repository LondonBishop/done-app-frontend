class TaskController {


    //****** CLIENT SIDE  ************************************************ */

    static loadPage(objState) {

        TaskController.renderUserSelector(objState._users);
        TaskController.renderTasks(objState._users);

        // add event listener
        let btnAdd = document.getElementById("add-task-form");
        btnAdd.addEventListener("submit", (e) => {

             event.preventDefault();

             let objTask = new Task;
             objTask.user_id = e.target.userselect.value;
             objTask.content = e.target.content.value;
             objTask.end_date = e.target.taskdate.value;

             TaskController.addTask(objTask);
        });
    }


    static reloadTasks(data) {
        let user = null;
        user = objState._users.find(obj =>  obj.id === data.user.id );
        user.tasks = data.user.tasks;

        //flush old  tasks
        document.getElementsByClassName('task-col1')[0].innerHTML = "";
        document.getElementsByClassName('task-col2')[0].innerHTML = "";
        document.getElementsByClassName('task-col3')[0].innerHTML = "";

        this.renderTasks(objState._users);
    }


    static buildTaskCard(task){
    
            let elTable = document.createElement('table');
            let displayDate = new Date(task.end_date).toLocaleDateString();

            elTable.className = "task-card col";
            elTable.id = "card-" + task.id;

            if(task.completed === true) {
                elTable.style.backgroundColor = "lightgrey"
            } else {
                elTable.style.backgroundColor = "rgb(74, 180, 247)";
            }

            let htmlString = ` 
                    <tbody>
                        <tr>
                            <td class="task-header">TASK</td>
                            <td class="btn-complete" id=${task.id} colspan="4" >
                            <button>${ task.completed === true ? "Re-Task" : "Complete"}</button></td>
                        </tr>
                        <tr>
                             <td class="task-content" colspan="4">${task.content}</td>
                        </tr>
                        <tr>
                            <td>${displayDate}</td>
                            <td class="task-indicator-g"></td>
                            <td class="task-indicator-y"></td>
                            <td class="task-indicator-r"></td>
                        </tr>
                </tbody>`

                elTable.innerHTML = htmlString;

                //set indicator
                switch (task.priority) {
                    case "g":
                        // elTable.getElementsByClassName("task-indicator-g")[0].style.visibility = "visible";
                        elTable.getElementsByClassName("task-indicator-g")[0].style.backgroundColor = "green";
                        break;
                    case "y":
                    // elTable.getElementsByClassName("task-indicator-y")[0].style.visibility = "visible";
                        elTable.getElementsByClassName("task-indicator-y")[0].style.backgroundColor = "yellow";
                        break;
                    case "r":
                    // elTable.getElementsByClassName("task-indicator-r")[0].style.visibility = "visible";
                        elTable.getElementsByClassName("task-indicator-r")[0].style.backgroundColor = "red";
                        break;
                }

                // add event listeners
                let btnComplete = elTable.querySelector(".btn-complete");
                btnComplete.addEventListener("click", (e) => {
                    TaskController.taskCompleted(task)
                });

                let btnTask = elTable.querySelector(".task-header");
                btnTask.addEventListener("click", (e) => {
                    TaskController.taskDelete(task)
                });

                return elTable;

        }


        static renderTaskCard(elTableCol, elCard) {
            elTableCol[0].appendChild(elCard);
        }
         

        static renderTasks(users) {

            let colCounter = 1;
            let elTableCol = null;

            users.forEach(user => {
    
                elTableCol = document.getElementsByClassName('task-col' + colCounter);
                
                //add user name header
                let elh2 = document.createElement('h2');
                elh2.innerHTML = `<h2>${user.name}</h2>`;
                elTableCol[0].appendChild(elh2);

                //add tasks for each users
                user.tasks.forEach(task => {
                    let elCard  = this.buildTaskCard(task);
                    this.renderTaskCard(elTableCol, elCard);
                });

                colCounter += 1;
            });
        }


        static renderUserSelector(users) {

            let userSelect = document.getElementById("userselect"); 
            
            users.forEach( user => {
                        let optionEl = document.createElement('option');
                        optionEl.value = user.id;
                        optionEl.innerText = user.name;
                        userSelect.appendChild(optionEl);
                        });
        }


        static renderTaskComplete(task) {
            task.completed = !task.completed;

            let elCard = document.getElementById("card-" + task.id)
            let btnComplete = document.getElementById(task.id).lastChild;

            if(task.completed === true) {
                btnComplete.innerText = "Re-Task";
                elCard.style.backgroundColor = "lightgrey"
            } else {
                btnComplete.innerText = "Complete";
                elCard.style.backgroundColor = "rgb(74, 180, 247)";
            }

        }


        static renderDeleteTask(task) {

            let user = null;
            user = objState._users.find(obj =>  obj.id === task.user_id );
            user.task = user.tasks.filter(obj => obj.id != task.id);
    
            //flush old  tasks
            document.getElementById('card-' + task.id).remove()
        }



    // ****************  SERVER SIDE *******

    static taskCompleted(task) {
        ServerApi.completeTask(task)
            .then(TaskController.renderTaskComplete(task));
        }


    static addTask(objTask) {
        ServerApi.createTask(objTask)
            .then(returnData => {
                this.reloadTasks(returnData);
                });
    }

    static taskDelete(task) {
        ServerApi.deleteTask(task)
        TaskController.renderDeleteTask(task);
    }

}

    
