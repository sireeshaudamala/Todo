
export const getAllTodos = async () =>{
    const response = await fetch('/todos');
    const data = await response.json();
    return data;
}

export const addTodo = async (todo) => {
    const response = await fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: todo, completed: false })
    });
    const data = await response.json();
    return data;
}

export const updateTodo = async (id, updatedFields) => {
    const response = await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
    });
    const data = await response.json();
    return data;
}

export const deleteTodo = async (id) => {
    const response = await fetch(`/todos/${id}`, {
        method: 'DELETE'
    });
    return response.ok;
}

export const addTask = async (todoId, task) => {
    const response = await fetch(`/todos/${todoId}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskName: task, status: false })
    });
    const data = await response.json();
    return data;
}

export const updateTask = async (todoId, taskId, updatedFields) => {
    try {
        const response = await fetch(`/todos/${todoId}/tasks/${taskId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFields)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export const getAllTasks = async (todoId) => {
    try {
        const response = await fetch(`/todos/${todoId}/tasks`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

export const deleteTask = async (todoId, taskId) => {
    const response = await fetch(`/todos/${todoId}/tasks/${taskId}`, {
        method: 'DELETE'
    });
    return response.ok;
}