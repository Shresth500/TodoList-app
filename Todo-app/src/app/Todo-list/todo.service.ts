import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Itodo } from '../Common/ITodo';

@Injectable({
  providedIn: 'root',
})
export class TodoService implements OnInit {
  constructor(private http: HttpClient) {}
  ngOnInit(): void {}
  getTodo() {
    return this.http.get<Itodo[]>(`http://localhost:3000/api/todos`);
  }

  edit(todo: Itodo) {
    return this.http.patch<Itodo>(
      `http://localhost:3000/api/todos/${todo._id}`,
      todo,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  addPost(todo: Omit<Itodo, '_id'>) {
    return this.http.post<Itodo>(`http://localhost:3000/api/todos/`, todo, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  deletetTodo(_id: string) {
    return this.http.delete<Itodo>(`http://localhost:3000/api/todos/${_id}`);
  }
}
