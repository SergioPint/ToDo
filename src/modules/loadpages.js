import { isThisISOWeek, isToday } from "date-fns";
import { Projects } from "./projects";

const Sidebar = ((page) => {
    const pageTitle = document.querySelector('.page-title');
    const pageCopy = document.querySelector('.page-copy');
    const itemTodo = document.querySelector('.no-to-do p');

    const todayPage = () => {
        pageTitle.textContent = "Today";
        pageCopy.textContent = "Your tasks today.";
        pageTitle.id = "today";
        itemTodo.textContent = 'No due tasks for today. Have a look on the tab "Week" and "All tasks" or create a new To-Do with the button on the bottom right.';
    };
    const weekPage = () => {
        pageTitle.textContent = "Week";
        pageCopy.textContent = "Your tasks this week.";
        pageTitle.id = "week";
        itemTodo.textContent = 'No due tasks this week. Have a look on the tab "All tasks" or create a new To-Do with the button on the bottom right.';
    };
    const allPage = () => {
        pageTitle.textContent = "All Tasks";
        pageCopy.textContent = "All tasks.";
        pageTitle.id = "all";
        itemTodo.textContent = 'No tasks. Create a new To-Do with the button on the bottom right.';
    };
    const projectsPage = () => {
        pageTitle.textContent = "Projects";
        pageCopy.textContent = "Add and remove projects.";
        pageTitle.id = "all";
        Projects().clearTodos
    };
    return {todayPage, weekPage, allPage, projectsPage};
})();

const LoadPage = (dueDate, pageTitle) => {
    if (isToday(dueDate) && pageTitle === "today") {
        Sidebar.todayPage();
        return "today"
    } else if (isThisISOWeek(dueDate) && pageTitle !== "all") {
        Sidebar.weekPage();
        return "week"
    } else {
        Sidebar.allPage();
        return "all"
    };
};

export { Sidebar, LoadPage};