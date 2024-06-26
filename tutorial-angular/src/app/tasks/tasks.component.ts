
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskComponent } from '../tasks/task/task.component'; 
import { NewTaskComponent } from './new-task/new-task.component';
import { TaskService } from './tasks.service';
import { type Task } from './task/task.model';


@Component({
    selector: 'app-tasks',
    standalone: true,
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
    imports: [TaskComponent, NewTaskComponent]
})
export class TasksComponent {
  @Input() name?: string; //Otra alternativa es @Input() name: string = string | undefined;
  @Input({ required:true }) UserId!: string;
  @Output() select = new EventEmitter();
  taskToEdit: Task | null = null;
  isAddingTask: boolean = false;

  //La instancia de TaskService se inyecta en el constructor, lo qu ela convierte en una clase TRANSVERSAL a todos los componentes.
  //En otras palabras, TaskService es un servicio que se puede usar en cualquier componente de la aplicación.
  constructor(private taskService: TaskService){}

  onSelectUser(id: string){
    this.select.emit(this.name); 
  }

  get selectedUserTasks() {
    return this.taskService.getUserTasks(this.UserId);
  }

  
  onSelectTask(id: string){
    console.log(id, ' ------- ', this.taskService.getUserTasks(this.UserId));
    this.taskService.removeTask(this.UserId);
  }
  
  onStartAddTask(){
      this.isAddingTask = true;
      this.taskToEdit = null;
      console.log('Añadiendo tarea = ', this.isAddingTask);
  }

  onCloseAddTask(){
    this.isAddingTask = false;
    this.taskToEdit = null;
  }

  onEditTask(task: Task){
    this.isAddingTask = true;
    this.taskToEdit = task;
    console.log('Recibiendo tarea desde el padre: ', this.taskToEdit, this.isAddingTask);
    
  }

}
