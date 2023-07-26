
// Import our custom CSS
import '../scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import { Todo } from './todo';
import { DBService } from './db-services'
import { Manager } from './manager';

let manager;

DBService.getAllTodos().then(todos => {
    manager = new Manager(todos);
    render();
})



function render() {

    const todoContainer = document.getElementById('todo-container');
    todoContainer.innerHTML = '';

    for (let i = 0; i < manager.todoArray.length; i++) {

        const todo = manager.todoArray[i];

        const div = document.createElement('div');
        div.classList.add('col-md-3');
        div.classList.add('card');
        // div.classList.add('m-3');
        div.classList.add('p-3');

        if (todo.isCompleted) {
            div.style.borderColor = 'lime';
            div.style.backgroundColor = '#00ff003b';
        }

        const titleStrong = document.createElement('strong');
        const titleNode = document.createTextNode(todo.title);

        titleStrong.appendChild(titleNode);
        div.appendChild(titleStrong);

        const dateSpan = document.createElement('span');
        const dateNode = document.createTextNode(todo.creationDate.toISOString());

        dateSpan.appendChild(dateNode);
        div.appendChild(dateSpan);

        const completeBtn = document.createElement('button');
        const completeNode = document.createTextNode(todo.isCompleted ? 'da completare' : 'completato');
        completeBtn.classList.add("btn");
        completeBtn.classList.add("btn-outline-success");
        completeBtn.classList.add("m-2");

        completeBtn.addEventListener('click', () => {

            const modifiedTodo = { ...todo };

            if (modifiedTodo.isCompleted === true) {
                modifiedTodo.isCompleted = false;
            } else {
                modifiedTodo.isCompleted = true;
            }

            DBService.updateTodo(modifiedTodo).then(res => {
                manager.changeCompleteStatus(i);
                render();
            })
        });

        completeBtn.appendChild(completeNode);
        div.appendChild(completeBtn);


        const deleteBtn = document.createElement('button');
        const deleteNode = document.createTextNode('cancella');
        deleteBtn.classList.add("btn");
        deleteBtn.classList.add("btn-outline-danger");
        deleteBtn.classList.add("m-2");
        deleteBtn.addEventListener('click', () => {

            DBService.deleteTodo(todo.id).then(() => {
                manager.deleteTodo(i);
                render();
            });
        });

        deleteBtn.appendChild(deleteNode);
        div.appendChild(deleteBtn);


        const detailBtn = document.createElement('button');
        const detailBtnNode = document.createTextNode('dettaglio');
        detailBtn.classList.add("btn");
        detailBtn.classList.add("btn-outline-primary");
        detailBtn.classList.add("m-2");
        detailBtn.setAttribute("data-bs-toggle", "modal");
        detailBtn.setAttribute("data-bs-target", "#detail");
        detailBtn.addEventListener('click', () => {
            // sessionStorage.setItem('selectedTodo', JSON.stringify(todo));
            // window.location.href = './detail.html';

            const detailModalBody = document.getElementById('detail-modal-body');
            detailModalBody.innerHTML = "";

            detailModalBody.innerHTML = `<h2>${todo.title}</h2>
            <span>${todo.isCompleted ? '' : 'non'} sono completato</span>
            <span>${todo.creationDate.toISOString()}</span>`

        });

        detailBtn.appendChild(detailBtnNode);
        div.appendChild(detailBtn);

        todoContainer.appendChild(div);
    }
}


const btnOrderByTitle = document.getElementById('btnOrderByTitle');
btnOrderByTitle.addEventListener('click', () => {
    manager.orderTodosByTitle();
    render();
});



const btnOrderByDate = document.getElementById('btnOrderByDate');
btnOrderByDate.addEventListener('click', () => {
    manager.orderTodosByDate();
    render();
});


const btnOrderByCompletion = document.getElementById('btnOrderByCompletion');
btnOrderByCompletion.addEventListener('click', () => {

    manager.orderTodosByCompletion();
    render();
});






const addTodoBtn = document.getElementById('add-todo-btn');
addTodoBtn.addEventListener('click', () => {

    var modal = document.getElementById('exampleModal');
    var modal = bootstrap.Modal.getInstance(modal)

    const input = document.getElementById('add-todo-input')
    const newTodoTitle = input.value;
    if (newTodoTitle.trim() !== '') {
        const newTodo = new Todo(newTodoTitle, false, new Date());

        DBService.saveTodo(newTodo).then(res => {
            manager.addTodo(res);
            input.value = '';
            render();
            modal.hide();
        })

    }
})








