import { Type } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getLocation() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  return { city: "San Jose", latitude: 37.3512, longitude: -121.8846 };
}

async function getCurrentWeather(latitude: string, longitude: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}

const weatherFunctionDeclaration = {
  name: "getCurrentWeather",
  description: "Gets the current temperature for a given location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      latitude: {
        type: Type.STRING,
        description: "latitude of the location",
      },
      longitude: {
        type: Type.STRING,
        description: "longitude of the location",
      },
    },
    required: ["latitude", "longitude"],
  },
};

const locationFunctionDeclaration = {
  name: "getLocation",
  description: "Gets the current location of the user",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export async function createTodoList(title: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return 'No valid user session found';

  return await prisma.todoList.create({
    data: {
      title,
      userId: session.user.id,
    },
  });
}

export const createTodoListDeclaration = {
  name: "createTodoList",
  description: "Create a new todo list for the current user.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "Title of the todo list",
      },
    },
    required: ["title"],
  },
};

export async function getTodoLists() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return 'No valid user session found';

  const todoLists = await prisma.todoList.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  console.log(todoLists);

  return {
    list: todoLists
  };
}

export const getTodoListsDeclaration = {
  name: "getTodoLists",
  description: "Fetch all todo lists for the current user.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

export async function getTodoListById(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return 'No valid user session found';

  return await prisma.todoList.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      tasks: true,
    },
  });
}

export const getTodoListByIdDeclaration = {
  name: "getTodoListById",
  description: "Fetch a todo list by ID including its tasks.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: "ID of the todo list",
      },
    },
    required: ["id"],
  },
};

export async function createTask(todoListId: string, title: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return 'No valid user session found';

  return await prisma.todoTask.create({
    data: {
      title,
      todoListId,
      completed: false,
    },
  });
}

export const createTaskDeclaration = {
  name: "createTask",
  description: "Add a new task to a todo list.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      todoListId: {
        type: Type.STRING,
        description: "ID of the todo list to add a task to",
      },
      text: {
        type: Type.STRING,
        description: "Content of the task",
      },
    },
    required: ["todoListId", "text"],
  },
};

export async function getTasks(todoListId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return 'No valid user session found';

  const tasks = await prisma.todoTask.findMany({
    where: {
      todoListId,
      todoList: { userId: session.user.id },
    },
    orderBy: { createdAt: "asc" },
  });

  return {
    tasks
  }
}

export const getTasksDeclaration = {
  name: "getTasks",
  description: "Fetch all tasks in a specific todo list.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      todoListId: {
        type: Type.STRING,
        description: "ID of the todo list",
      },
    },
    required: ["todoListId"],
  },
};

export async function updateTask(
  taskId: string,
  updates: { text?: string; completed?: boolean }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return 'No valid user session found';

  return await prisma.todoTask.updateMany({
    where: {
      id: taskId,
      todoList: { userId: session.user.id },
    },
    data: updates,
  });
}

export const updateTaskDeclaration = {
  name: "updateTask",
  description: "Update a task's text or completion status.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      taskId: {
        type: Type.STRING,
        description: "ID of the task",
      },
      text: {
        type: Type.STRING,
        description: "Updated text for the task (optional)",
      },
      completed: {
        type: Type.BOOLEAN,
        description: "Mark the task as completed or not",
      },
    },
    required: ["taskId"],
  },
};

export async function deleteTask(taskId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return 'No valid user session found';

  return await prisma.todoTask.deleteMany({
    where: {
      id: taskId,
      todoList: { userId: session.user.id },
    },
  });
}

export const deleteTaskDeclaration = {
  name: "deleteTask",
  description: "Delete a task by its ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      taskId: {
        type: Type.STRING,
        description: "ID of the task",
      },
    },
    required: ["taskId"],
  },
};

export async function getTodoListByTitle(query: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return "No valid user session found";

  return await prisma.todoList.findMany({
    where: {
      userId: session.user.id,
      title: {
        contains: query,
        mode: "insensitive", // case-insensitive match
      },
    },
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export const getTodoListByTitleDeclaration = {
  name: "getTodoListByTitle",
  description: "Search for todo lists by a partial or full title match (case-insensitive).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "Search string to match against todo list titles.",
      },
    },
    required: ["query"],
  },
};



export const functionDeclarations = [
  weatherFunctionDeclaration,
  locationFunctionDeclaration,
  createTodoListDeclaration,
  getTodoListByTitleDeclaration,
  deleteTaskDeclaration,
  updateTaskDeclaration,
  getTasksDeclaration,
  createTaskDeclaration,
  getTodoListByIdDeclaration,
  getTodoListsDeclaration
];

export const availableTools = {
  getCurrentWeather,
  getLocation,
  createTodoList,
  getTodoLists,
  getTodoListByTitle,
  deleteTask,
  updateTask,
  getTasks,
  createTask,
  getTodoListById
};

export const toolNameMapper = {
    getCurrentWeather: "Fetching weather",
    getLocation: "Getting location",

    createTodoList: "Creating todo list",
    getTodoLists: "Fetching all todo lists",
    getTodoListByTitle: "Searching todo lists by title",
    getTodoListById: "Fetching todo list details",

    createTask: "Creating task",
    getTasks: "Fetching tasks",
    updateTask: "Updating task",
    deleteTask: "Deleting task",
}