package org.example.todo.controller;

import org.example.todo.Task;
import org.example.todo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping({"/{id}/tasks"})
    public List<Task> getAllTasksById(@PathVariable Long id) {
        return taskService.getAllTasksById(id);
    }

    @PostMapping("/{id}/tasks")
    public Task createTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.createTask(id, task);
    }

    @PutMapping("/{todoId}/tasks/{taskId}/status")
    public Task updateTask(@PathVariable Long todoId, @PathVariable Long taskId, @RequestBody Task task) {
        return taskService.updateTask(todoId, taskId, task);
    }

    @DeleteMapping({"/{todoId}/tasks/{taskId}"})
    public void deleteTask(@PathVariable Long todoId, @PathVariable Long taskId) {
        taskService.deleteTask(todoId, taskId);
    }

}