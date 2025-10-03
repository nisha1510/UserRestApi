import Todo from "../models/Todo.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const todo = new Todo({
      userId: req.user.id, // from verifyToken
      title,
      description,
      dueDate
    });
    const savedTodo = await todo.save();
    res.status(201).json({ 
      message: "Todo created",
      todo : savedTodo
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    res.status(500).json({message: "error while creating Todo"})
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const updatedtodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, status, dueDate },
      { new: true }
    );
    if (!updatedtodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({
      message:"Todo updated successfully",
      todo: updateTodo
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
