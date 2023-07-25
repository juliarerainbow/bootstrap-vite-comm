
import { Todo } from "./todo";

export class DBService{

    //GET
    static getAllTodos(){
        const url = 'https://64b512c3f3dbab5a95c6a4a0.mockapi.io/todos';
        return fetch(url)
        .then(resp => resp.json())
        .then(result => this.convertToTodoArray(result))
        .catch(error => console.log(error.message));
    }

    //DELETE
    static deleteTodo(id){
        console.log('delete', id);
        const deleteUrl = 'https://64b512c3f3dbab5a95c6a4a0.mockapi.io/todos/' + id;
        console.log(deleteUrl);
        return fetch(deleteUrl, {method: 'delete'}).then(resp => resp.json());
    }

    //PUT
    static updateTodo(todo){
        const updateUrl = 'https://64b512c3f3dbab5a95c6a4a0.mockapi.io/todos/' + todo.id;
        return fetch(updateUrl, {method: 'put', 
                                 body: JSON.stringify(todo),
                                 headers: {
                                    'content-type':'application/json'
                                 }})
                    .then(resp => resp.json())
                    .then(res => this.convertToTodo(res))
    }

    //UPDATE
    static saveTodo(todo){
        const postUrl = 'https://64b512c3f3dbab5a95c6a4a0.mockapi.io/todos'
        return fetch(postUrl, {method: 'post', 
                                 body: JSON.stringify(todo),
                                 headers: {
                                    'content-type':'application/json'
                                 }})
                    .then(resp => resp.json())
                    .then(res => this.convertToTodo(res))
    }


    static convertToTodo(obj){
        const newTodo = new Todo(obj.title, obj.isCompleted, new Date(obj.creationDate), obj.id);
        return newTodo;
    }

    static convertToTodoArray(genericArray){

        const tempArray = [];

        for (const obj of genericArray) {
            //const newTodo = new Todo(obj.title, obj.isCompleted, new Date(obj.creationDate), obj.id)
            tempArray.push(this.convertToTodo(obj));
        }

        return tempArray;

    }


}