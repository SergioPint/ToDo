import { Storage, ChangeOrder, Filter } from "./todo";
import { CreateItem, MarkToDo, OptionController, PriorityCheckbox, PriorityProjects } from "./domhandler";
import { isThisISOWeek, isToday, parseISO } from "date-fns";
import { InitializeProjects } from "./projects";

const Initial = (page) => {   
    if (document.querySelector('.active-filter')) document.querySelector('.active-filter').classList.remove('active')

    if (localStorage.getItem("todoStorage") !== null) {
        allItems = Storage.getList('todoStorage');
    };

    
    if (localStorage.getItem("userSettings") !== null) {
        
        settings = Storage.getList('userSettings');
        
        if (settings.sort.length > 0) {
            if (settings.sort === "asc") {
                ChangeOrder.asc(allItems);
                OptionController.changeOptionsText("asc");
            }; if (settings.sort === "desc") {
                ChangeOrder.desc(allItems);
                OptionController.changeOptionsText("desc");
            }; if (settings.sort === "creationDate") {
                ChangeOrder.creationDate(allItems);
                OptionController.changeOptionsText("creationDate");
            };
            Storage.updateList('todoStorage', allItems);
        }
        if (settings.filterPriority.length > 0) {
            document.querySelector('.active-filter').classList.add('active')
            Storage.updateList('todoStorage', allItems);
            allItems = Filter().priority()
        }
        if (settings.filterProjects.length > 0) {
            document.querySelector('.active-filter').classList.add('active')
            allItems = Filter().projects()
        }
    }
    for (let i = allItems.length - 1; i >= 0; i--) {            
        if (page === "today") {
            if (isToday(parseISO(allItems[i].dueDate))){
                CreateItem(allItems[i].title, allItems[i].dueDate, allItems[i].status, allItems[i].uniqueID, i);
            };
        }; 
        if (page === "week") {
            if (isThisISOWeek(parseISO(allItems[i].dueDate))){
                CreateItem(allItems[i].title, allItems[i].dueDate, allItems[i].status, allItems[i].uniqueID, i);
            };
        };
        if (page === "all") {
            CreateItem(allItems[i].title, allItems[i].dueDate, allItems[i].status, allItems[i].uniqueID, i);
        }
    };
    if (localStorage.getItem("todoStorage") !== null) {
        allItems = Storage.getList('todoStorage');
    };
    MarkToDo.countMarked();
    InitializeProjects.createOptionElements();
    PriorityCheckbox.createOptionElements();
    PriorityProjects().createOptionElements();
    const itemTodo = document.querySelector('.to-do-category');
    const noTodo = document.querySelector('.no-to-do');
    if (itemTodo.childElementCount >= 1) {
        noTodo.classList.add('active')
    } else if (itemTodo.childElementCount === 0 && noTodo.classList[1] === 'active') {
        noTodo.classList.remove('active')
    }
};

const Clean = (page) => {   
    let itemTodo = document.querySelector(".to-do-category");

    while (itemTodo.firstChild) {
        itemTodo.removeChild(itemTodo.firstChild);
    };
    
    let itemDone = document.querySelector(".done-category");
    while (itemDone.firstChild) {
        itemDone.removeChild(itemDone.firstChild);
    };
    Initial(page);
};

export {Initial, Clean};
