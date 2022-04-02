import { MenuEvents } from "./domhandler"
import { Clean } from "./initial";
import { compareAsc, compareDesc, parseISO } from "date-fns";
import { filter, findIndex } from "lodash";

window.allItems = [];

//To-Do structure and functions

const Todo = (title, description, dueDate, project, priority, status, creationDate, uniqueID) => {
    const todoStructure = {
        title: title,
        description: description,
        dueDate: dueDate,
        project: project,
        priority: priority,
        status: status,
        creationDate: creationDate,
        uniqueID: uniqueID,
    }
    const getStatus = () => status;
    return { todoStructure, getStatus };
};


//Create a new To-Do

const CreateTodo = (title, description, dueDate, project, priority, status, creationDate, loadPage) => {
    const uniqueID = Date.now();
    const newItem = Todo(title, description, dueDate, project, priority, status, creationDate, uniqueID).todoStructure;
    Storage.setList(newItem, 'todoStorage', allItems);
    Clean(loadPage);
    MenuEvents.activeProjects();
    MenuEvents.removeClass(loadPage);
};

//Change Status of To-Do
const ChangeStatus = (itemID, page) => {
    if (allItems[itemID].status === "todo") {
        allItems[itemID].status = "done"
        Storage.updateList('todoStorage', allItems);
        Clean(page);
    } else {
        allItems[itemID].status = "todo"
        Storage.updateList('todoStorage', allItems);
        Clean(page);
    }; 
}; 

//Edit To-Do

const EditTodo = (title, description, dueDate, project, priority, itemID, creationDate, loadPage) => {
    console.log(itemID)
    allItems[itemID].title = title;
    allItems[itemID].description = description;
    allItems[itemID].dueDate = dueDate;
    allItems[itemID].project = project;
    allItems[itemID].priority = priority;
    allItems[itemID].creationDate = creationDate;
    Storage.updateList('todoStorage', allItems);
    Clean(loadPage);
    MenuEvents.removeClass(loadPage);
};

//Delete To-Do 

const DeleteTodo = (itemID, pageTitle) => {
    allItems.splice(itemID, 1);
    Storage.updateList('todoStorage', allItems);
    Clean(pageTitle);
};

//change order in object

const ChangeOrder = (() => {
    const creationDate = (object) => {
        object.sort((a, b) => compareDesc(parseISO(a.creationDate), parseISO(b.creationDate)));
    }
    const desc = (object) => {
        object.sort((a, b) => compareDesc(parseISO(a.dueDate), parseISO(b.dueDate)));
    }
    const asc = (object) => {
        object.sort((a, b) => compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)));
    } 
    return {creationDate, desc, asc};  
})();

//Stores the Users prefferences

window.settings = {
    sort: 'creationDate',
    filterPriority: [],
    allProjects: ['General', 'Work', 'Gym', 'Study'],
    filterProjects: [],
};

//Filter To-Dos
const Filter = () => {
    const priority = () => _.filter(allItems, (item) => { return settings.filterPriority.includes(item.priority)});
    const projects = () => _.filter(allItems, (item) => { return settings.filterProjects.includes(item.project)});
    return { priority, projects }
}

//Change the user settings

const ChangeSettings = ((sort, filterPriority, filterProjects, pageTitle) => {
    const setSort = (sort, pageTitle) => {
        settings.sort = sort
        Storage.updateList('userSettings', settings);
        Clean(pageTitle);
    };
    const setPriority = (filterPriority, pageTitle) => {
        settings.filterProjects = filterPriority
        Storage.updateList('userSettings', settings);
        Clean(pageTitle);
    };
    const setProjects = (filterProjects, pageTitle) => {
        settings.filterProjects = filterProjects
        Storage.updateList('userSettings', settings);
        Clean(pageTitle);
    };
    return { setSort, setPriority, setProjects }
})();

//Set and get localstorage

const Storage = (() => {
    const setList = (newItem, nameStorage, object) => {
        object.push(newItem);
        localStorage.setItem(nameStorage, JSON.stringify(object));
    };
    const getList = (nameStorage) => {
        return JSON.parse(localStorage.getItem(nameStorage))
    };
    const updateList = (nameStorage, object) => {
        return localStorage.setItem(nameStorage, JSON.stringify(object));
    }
    return {setList, getList, updateList};
})();


export { Todo, CreateTodo, ChangeStatus, EditTodo, DeleteTodo, ChangeOrder, Filter, ChangeSettings, Storage }