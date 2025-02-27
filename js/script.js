const loading = true;
const todoParent = document.querySelector(".todos-wrapper");
const todoForm = document.querySelector(".add-todo-form");
const textArea = document.querySelector("#text");
let doneTasks = 0;


const getTasks = async () => {
  try {
    const resp = await fetch(
      "https://us-central1-js04-b4877.cloudfunctions.net/tasks"
    );
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const showDoneTasks = (taskNum)=>{
    document.querySelector(".done-tasks-num").textContent = `Completed tasks: ${taskNum}`;
}


const removeAllTodos = () => {
  const todos = Array.from(document.querySelectorAll(".todo"));
  todos.forEach((todo) => {
    todo.remove();
  });
};

const handlebuttonClick = (e) => {
  console.log(e.target.id);
  deleteTask(e.target.id).then(() => {
    getTasks().then((res) => {
      removeAllTodos();
      showTasks(res);
    });
  });
};

const showTasks = (res) => {
  removeAllTodos();
  const data = res.data;
  data.forEach((task,i) => {
    const todoWrapper = document.createElement("div");
    todoWrapper.classList.add("todo");
    todoWrapper.style.animationDelay = `${i*0.2}s`
    task.completed && todoWrapper.classList.add("done");
    task.completed && doneTasks++;
    console.log(doneTasks)
    const paragraph = document.createElement("p");
    paragraph.classList.add("todo-p");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = task.completed;
    checkbox.setAttribute("id", task.id);
    checkbox.classList.add("status")
    checkbox.addEventListener("change",toggleChecked)
    paragraph.textContent = task.text;
    const button = document.createElement("button");
    button.classList.add("todo-remove");
    button.textContent = "Delete";
    button.setAttribute("id", task.id);
    button.addEventListener("click", handlebuttonClick);

    const date = document.createElement("span");
    date.classList.add("date");
    date.textContent = task.create_time;
    // console.log(task.create_time);

    todoWrapper.appendChild(paragraph);
    todoWrapper.appendChild(checkbox);
    todoWrapper.appendChild(button);
    todoWrapper.appendChild(date);

    todoParent.appendChild(todoWrapper);
    showDoneTasks(doneTasks);
    // console.log(task);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getTasks().then((res) => {
    showTasks(res);
  });
});


todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = textArea.value;
  console.log(text);
  create(text).then((res) => {
    getTasks().then((res) => {
      showTasks(res);
    });
  });
});

const create = async (text) => {
  try {
    const res = await fetch(
      "https://us-central1-js04-b4877.cloudfunctions.net/tasks/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      }
    );
    return res.json();
  } catch (err) {
    console.error({ err });
  }
  getTasks().then((res) => {
    showTasks(res);
  });
};

const deleteTask = async (id) => {
  try {
    const res = await fetch(
      `https://us-central1-js04-b4877.cloudfunctions.net/tasks/${id}`,
      {
        method: "DELETE",
      }
    );
    return res.json();
  } catch (err) {
    console.error({ err });
  }
  getTasks().then((res) => {
    showTasks(res);
  });
};

const toggleChecked = async (e) =>{
    e.target.parentNode.classList.toggle("done");

    try {
        const res = await fetch(
          `https://us-central1-js04-b4877.cloudfunctions.net/tasks/${e.target.checked ? "check" : "uncheck" }/${e.target.id}`,
          {
            method: "POST",
          }
        );   
        console.log(res.json());     
    } catch (err) {
    console.error({ err });
    }
    e.target.checked? doneTasks++ : doneTasks--;
    showDoneTasks(doneTasks);
    // getTasks().then((res) => {
    //     showTasks(res);
    // });
}
