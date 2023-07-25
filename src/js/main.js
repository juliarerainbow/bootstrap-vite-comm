
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







function render(){
    
    const todoContainer=document.getElementById('todo-container'); 
    todoContainer.innerHTML= '';

    for (let i = 0; i < manager.todoArray.length; i++) {

        const todo = manager.todoArray[i];

        const div=document.createElement('div');
        div.classList.add('todo-card');

        if(todo.isCompleted){
            div.style.borderColor='lime';
        }

        const titleStrong=document.createElement('strong');
        const titleNode=document.createTextNode(todo.title);

        titleStrong.appendChild(titleNode);
        div.appendChild(titleStrong);
        
        const dateSpan=document.createElement('span');
        const dateNode=document.createTextNode(todo.creationDate.toISOString());

        dateSpan.appendChild(dateNode);
        div.appendChild(dateSpan);

        const completeBtn = document.createElement('button');
        const completeNode = document.createTextNode( todo.isCompleted ? 'da completare' : 'completato');
        completeBtn.classList.add("btn-success");
        completeBtn.addEventListener('click', () => {

            const modifiedTodo = {...todo};

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
        detailBtn.addEventListener('click', () => {
            sessionStorage.setItem('selectedTodo', JSON.stringify(todo));
            window.location.href = './detail.html';
        });
       
        detailBtn.appendChild(detailBtnNode);
        div.appendChild(detailBtn);

        todoContainer.appendChild(div);
    }
}


const btnOrderByTitle = document.getElementById('btnOrderByTitle');
btnOrderByTitle.addEventListener('click', () => {    console.log('cc')
                                                    manager.orderTodosByTitle();
                                                    render();
                                                });



const btnOrderByDate = document.getElementById('btnOrderByDate');
btnOrderByDate.addEventListener('click', () => {    console.log('cc')
                                                    manager.orderTodosByDate();
                                                    render();
                                                });





function orderByDate(){
    manager.orderTodosByDate();
    render();
}


