import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { Itodo } from '../../Common/ITodo';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  faTrash = faTrash;
  filteredtodoList: Itodo[] = [];
  editedtodo!: Itodo;
  todoList: Itodo[] = [];
  display: number = 3;
  filterKey = '';
  isChecked: boolean = false;
  constructor(private todoService: TodoService, private router: Router) {}
  ngOnInit(): void {
    this.getTodo();
  }
  getTodo() {
    this.todoService.getTodo().subscribe({
      next: (Todolist) => {
        console.log(Todolist);
        this.filteredtodoList = Todolist;
        this.todoList = Todolist;
      },
    });
  }
  getAll(display: number = 3) {
    if (display === 4) {
      let ids = [];
      for (let i = 0; i < this.filteredtodoList.length; i++) {
        ids.push(this.filteredtodoList[i]._id);
      }
      for (let i = 0; i < this.filteredtodoList.length; i++) {
        this.onDelete(ids[i]);
      }
    } else if (display === 3) {
      this.filteredtodoList = this.todoList;
      this.display = display;
    } else if (display === 2) {
      this.filteredtodoList = this.todoList.filter((todo) => !todo.completed);
      this.display = display;
    } else {
      this.filteredtodoList = this.todoList.filter((todo) => todo.completed);
      this.display = display;
    }
  }

  getCompleted(_id: string) {
    this.filteredtodoList.forEach((todo) => {
      if (todo._id === _id) {
        this.editedtodo = todo;
        this.editedtodo.completed = !this.editedtodo.completed;
        return;
      }
    });
    this.todoService.edit(this.editedtodo).subscribe({
      next: (updatedTodo) => {
        console.log(updatedTodo);
        this.getAll(this.display);
        //this.router.navigateByUrl('');
        // Do something with the updated todo, like updating the UI
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        // Handle error
      },
    });
  }

  onFunction(event: KeyboardEvent | FocusEvent): void {
    if (
      event instanceof KeyboardEvent &&
      event.key === 'Enter' &&
      this.filterKey !== ''
    ) {
      console.log('Enter key was pressed');
      console.log(this.filterKey);
      let todo: Omit<Itodo, '_id'> = {
        name: this.filterKey,
        completed: false,
        __v: 0,
      };
      this.todoService.addPost(todo).subscribe({
        next: (addedTodo) => {
          this.filterKey = '';
          this.todoList.push(addedTodo);
          this.filteredtodoList = this.todoList;
        },
      });
      // You can also handle other logic when Enter is pressed
    }
    if (event instanceof FocusEvent && this.filterKey !== '') {
      console.log('Enter key was pressed');
      console.log(this.filterKey);
      let todo: Omit<Itodo, '_id'> = {
        name: this.filterKey,
        completed: false,
        __v: 0,
      };
      this.todoService.addPost(todo).subscribe({
        next: (addedTodo) => {
          this.filterKey = '';
          this.todoList.push(addedTodo);
          this.filteredtodoList = this.todoList;
        },
      });
    }
  }
  onDelete(_id: string) {
    console.log(_id);
    this.todoService.deletetTodo(_id).subscribe({
      next: (deletedTodo) => {
        alert(`Successfully Deleted ${_id}`);
        this.filteredtodoList = this.todoList.filter(
          (todo) => todo._id !== _id
        );
        this.todoList = this.filteredtodoList;
        window.location.reload();
      },
    });
  }
}
