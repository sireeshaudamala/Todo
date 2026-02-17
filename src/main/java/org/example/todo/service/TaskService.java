package org.example.todo.service;

import org.example.todo.Task;
import org.example.todo.repository.TaskRepository;
import org.example.todo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TodoRepository todoRepository;

    public List<Task> getAllTasksById(Long id) {
        todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found with id " + id));
        return taskRepository.findByTodoId(id);
    }

    public Task createTask(Long todoId, Task task) {
        var todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found with id " + todoId));
        task.setTodo(todo);
        return taskRepository.save(task);
    }

    public Task updateTask(Long todoId, Long taskId, Task updatedTask) {
        var todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found with id " + todoId));
        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + taskId));
        if (!task.getTodo().getId().equals(todo.getId())) {
            throw new RuntimeException("Task with id " + taskId + " does not belong to Todo with id " + todoId);
        }
        task.setStatus(updatedTask.isStatus());
        if (updatedTask.getTaskName() != null) {
            task.setTaskName(updatedTask.getTaskName());
        }
        return taskRepository.save(task);
    }

    public void deleteTask(Long todoId, Long taskId) {
        var todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found with id " + todoId));
        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + taskId));
        if (!task.getTodo().getId().equals(todo.getId())) {
            throw new RuntimeException("Task with id " + taskId + " does not belong to Todo with id " + todoId);
        }
        taskRepository.deleteById(taskId);
    }
}

