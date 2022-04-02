import { CreateTodo, ChangeStatus, DeleteTodo, EditTodo, Todo, ChangeOrder, ChangeSettings, Storage } from "./todo";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { Clean } from "./initial";
import { Sidebar, LoadPage } from "./loadpages";
import { DeleteProject, InitializeProjects } from "./projects";

//EventListeners for the menu

const MenuEvents = (() => {
    const menu = document.querySelector("ul");
    const removeClass = (page) => {
        document.querySelector(".menu .active").classList.remove('active')
        document.getElementById(page).classList.add('active');
    }

    const activeProjects = () => {
        const hide = document.querySelector('.to-do-container.hide');
        const hideAdd = document.querySelector('button.new-to-do');
        if (hide !== null) {
            hide.classList.remove('hide');
            hideAdd.classList.remove('hide');
            document.querySelector('.add').remove();  
            document.querySelector('.container-projects').remove();
        }

    }; document.querySelector('.to-do-container.hide');

    menu.addEventListener('click', (e) => {
        if (e.target.id === "today_menu" || e.target.parentNode.id === "today" || e.target.parentNode.parentNode.id === "today") {
            Sidebar.todayPage();
            activeProjects();
            Clean('today')
            removeClass('today');
            window.scrollTo(0, 0);
        } else if (e.target.id === "week" || e.target.parentNode.id === "week" || e.target.parentNode.parentNode.id === "week") {
            Sidebar.weekPage();
            activeProjects();
            Clean('week')
            removeClass('week');
            window.scrollTo(0, 0);
        } else if (e.target.id === "all" || e.target.parentNode.id === "all" || e.target.parentNode.parentNode.id === "all") {
            Sidebar.allPage();
            activeProjects();
            Clean('all')
            removeClass('all');
            window.scrollTo(0, 0);
        } else if (e.target.id === "projects" || e.target.parentNode.id === "projects" || e.target.parentNode.parentNode.id === "projects") {
            const hide = document.querySelector('.to-do-container.hide');
            if (hide === null) {
                Sidebar.projectsPage('projects');
            }
            removeClass('projects');
            window.scrollTo(0, 0);
        };
    });
    return { removeClass, activeProjects }
})();


//Submits the form for a new To-Do
const Submit = (() => {

    const form = document.querySelector("form#add-to-do");

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.querySelector('#add-to-do #title').value;
        const description = document.querySelector('#add-to-do #description').value;
        const dueDate = new Date(document.querySelector('#add-to-do #date').value);
        const project = document.querySelector("#add-to-do select").value;
        const priority = document.querySelector('#add-to-do input[name="priority"]:checked').value;
        const pageTitle = document.querySelector('.page-title').id;
        CreateTodo(title, description, dueDate, project, priority, "todo", new Date(), LoadPage(dueDate, pageTitle));
        ModalController.deactivateModal();
        document.querySelector('form#add-to-do').reset();    
    });

})();

//Edit an existing To-Do

const Edit = (() => {
    const form = document.querySelector("form#details");

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.querySelector('#details #title').value;
        const description = document.querySelector('#details #description').value;
        const dueDate = new Date(document.querySelector('#details #date').value);
        const project = document.querySelector("#details select").value;
        const priority = document.querySelector('#details input[name="priority"]:checked').value;
        const pageTitle = document.querySelector('.page-title').id;
        EditTodo(title, description, dueDate, project, priority, event.target.parentNode.id, new Date(), LoadPage(dueDate, pageTitle));
        ModalController.deactivateDetails(); 
    });

})();

//Delete a To-Do

const DeleteItem = (() => {
    const content = document.querySelector('.content');
    content.addEventListener('click', (e) => {
        const index = _.findIndex(allItems, function(o) { return o.uniqueID == e.target.parentNode.getAttribute("data-uniqueid"); });
        const pageTitle = document.querySelector('.page-title').id;
        if (e.target.classList[0] === "delete") {
            DeleteTodo(index, pageTitle);
        };
    });

    let touchstartX;
    let touchendX;

    content.addEventListener('touchstart', function (e) {
        touchstartX = e.changedTouches[0].screenX;
    }, false);
    
    content.addEventListener('touchend', function (e) {
        const index = _.findIndex(allItems, function(o) { return o.uniqueID == e.target.parentNode.getAttribute("data-uniqueid"); });
        const deleteButton = document.querySelector(`.item${index} .delete`);
        touchendX = e.changedTouches[0].screenX;
        
            if (touchendX < touchstartX && e.target.classList[0] === "due-date") {
                deleteButton.classList.add('active');
            } else if (touchendX > touchstartX && e.target.classList[0] === "due-date") {
                deleteButton.classList.remove('active');
            }
    }, false);
})();


//Create a new Item on DOM

const CreateItem = (newTitle, newDate, status, uniqueID, i) => {
    const todo = document.querySelector(".to-do-category");
    const done = document.querySelector(".done-category");
    const item = document.createElement("div");
    const checkbox = document.createElement("div");
    const title = document.createElement("div");
    const dueDate = document.createElement("div");
    const del = document.createElement("div");

    item.classList.add("item");
    checkbox.classList.add("checkbox")
    title.classList.add("title");
    dueDate.classList.add("due-date")
    del.classList.add("delete")
    if (status === "todo") {
        todo.insertBefore(item, todo.firstChild);
    } else if (status === "done") {
        done.insertBefore(item, done.firstChild);
        (allItems[i].status === 'done') ? checkbox.classList.add('done') : false;
    };
    
    item.append(checkbox, title, dueDate, del);
    item.id = i;
    item.setAttribute('data-uniqueID', uniqueID)
    item.classList.add(`item${i}`)

    title.textContent = newTitle;
    dueDate.textContent = new Date(newDate).toLocaleDateString("en-GB", {year: 'numeric', month: 'numeric', day: 'numeric'});
    return {title, dueDate};
};

//Mark an To-Do done or reverse

const MarkToDo = (() => {
    const content = document.querySelector(".content");
    content.addEventListener('click', (e) => {
        const itemClass = e.target.parentNode.classList[1];
        const itemID = _.findIndex(allItems, function(o) { return o.uniqueID == e.target.parentNode.getAttribute("data-uniqueid"); });;
        const pageTitle = document.querySelector('.page-title').id;
        if (e.target.classList[0] === "checkbox") {
            if (!e.target.classList.contains('done')) {
                document.querySelector(`.${itemClass} .checkbox`).classList.add('done');
                ChangeStatus(itemID, pageTitle);
            } else {
                document.querySelector(`.${itemClass} .checkbox`).classList.remove('done');
                ChangeStatus(itemID, pageTitle);
            }
            
        };
    });
    const countMarked = () => {
        const count = document.querySelector('.done-category').childElementCount;
        if (count !== 0) {
            document.querySelector('.title-done').classList.add('active');
        } else if (count === 0) {
            document.querySelector('.title-done').classList.remove('active');
        }
    };
    return { countMarked };
})();

//Create a new detail view of an item on DOM

const CreateDetailView = (itemID) => {  
    const index = _.findIndex(allItems, function(o) { return o.uniqueID == itemID; });
    document.querySelector('.details').id = index;
    document.querySelector('.details #title').value = allItems[index].title;
    document.querySelector('.details #description').textContent = allItems[index].description;
    document.querySelector('.details #date').value = format(parseISO(allItems[index].dueDate), 'yyyy-MM-dd');
    document.querySelector('.details #detail-projects').value = allItems[index].project;
    document.getElementById(allItems[index].priority).checked = true;
}

//Filter and Sort Options

const OptionController = (() => {
    const order = document.querySelector('.options');
    const sortController = (() => {
        const menuOrder = document.querySelector('.menu-order');
        order.addEventListener('click', (e) => {
            const pageTitle = document.querySelector('.page-title').id;
            const active = document.querySelector('.menu-order.active');

            if (e.target.parentNode.classList[0] === "order" || e.target.classList[0] === "order" || e.target.parentNode.parentNode.classList[0] === "order" &&  active === null) {
                menuOrder.classList.add('active');
            } else if (e.target.id === "creationDate") {
                ChangeOrder.creationDate(allItems)
                ChangeSettings.setSort('creationDate', pageTitle); 
                changeOptionsText("creationDate");
            } else if (e.target.id === "asc") {
                ChangeOrder.asc(allItems)
                ChangeSettings.setSort('asc', pageTitle);
                changeOptionsText("asc");
            } else if (e.target.id === "desc") {
                ChangeOrder.desc(allItems)
                ChangeSettings.setSort('desc', pageTitle);
                changeOptionsText("desc");; 
            } 
        });
        document.addEventListener('mouseup', (e) => {
            const menu = document.querySelector('.menu-order');
            if (e.target !== menu && e.target.parentNode !== menu) 
                menuOrder.classList.remove('active');            
        });        
    })();    
    const filterController = (() => {
        const menuFilter = document.querySelector('.menu-filter');
        
        order.addEventListener('click', (e) => {
            const pageTitle = document.querySelector('.page-title').id;
            const active = document.querySelector('.menu-filter.active');
            if (e.target.parentNode.classList[0] === "filter" || e.target.classList[0] === "filter" || e.target.parentNode.parentNode.classList[0] === "filter" && active === null) {
                menuFilter.classList.add('active');
            }  
        });
        document.addEventListener('mouseup', (e) => {
            const menu = document.querySelector('.menu-filter');
            if (e.target !== menu && e.target.parentNode.parentNode !== menu && e.target.parentNode.parentNode.parentNode !== menu) 
                menuFilter.classList.remove('active');
            
        });   
    })();  

    const changeOptionsText = (option) => {
        const orderText = document.querySelector('.order-text');
        if (option === 'creationDate') {
            orderText.textContent = "Creation Date";
        }; 
        if (option === 'asc') {
            orderText.textContent = "Ascending";
        }; 
        if (option === 'desc') {
            orderText.textContent = "Descending";
        };
    }
    return { changeOptionsText }
})();

//Modalcontroller and Detail view Overlay

const ModalController = (() => {
    const openModalButton = document.querySelectorAll('.new-to-do');
    const openDetailsButton = document.querySelectorAll('.content');
    const closeButton = document.querySelectorAll('.close');
    const modal = document.querySelector('.modal');
    const details = document.querySelector('.details');
    const overlay = document.getElementById('overlay');
    let touchstartY;
    let touchendY;
    
    
    openModalButton.forEach(button => {
        button.addEventListener('click', () => {
            InitializeProjects.cleanDropdown('#add-projects');
            InitializeProjects.createElements();
            activateModal()
        })
    });

    openDetailsButton.forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.classList[0] === "title" || e.target.classList[0] === "due-date") {                
                InitializeProjects.cleanDropdown('#detail-projects');
                InitializeProjects.createElements();
                CreateDetailView(e.target.parentNode.getAttribute("data-uniqueid"));
                activateDetails()
            }
        })
    });

    closeButton.forEach(button => {
        button.addEventListener('click', () => {
            if (document.querySelector('.modal.active') !== null) {
                deactivateModal();
            } else {
                deactivateDetails();
            }
        })
    });

    modal.addEventListener('touchstart', function (event) {
        touchstartY = event.changedTouches[0].screenY;
    }, false);
    
    modal.addEventListener('touchend', function (event) {
        touchendY = event.changedTouches[0].screenY;
        
            if (touchendY > touchstartY) {
                deactivateModal();
            }
    }, false);

    details.addEventListener('touchstart', function (event) {
        touchstartY = event.changedTouches[0].screenY;
    }, false);
    
    details.addEventListener('touchend', function (event) {
        touchendY = event.changedTouches[0].screenY;
        
            if (touchendY > touchstartY) {
                deactivateDetails();
            }
    }, false);

    overlay.addEventListener('click', () => {
        if (document.querySelector('.modal.active') !== null) {
            deactivateModal();
        } else {
            deactivateDetails();
        }
    })

    const activateModal = () => {
        modal.classList.add('active')
        overlay.classList.add('active')
    };

    const activateDetails = () => {
        details.classList.add('active')
        overlay.classList.add('active')
    };

    const deactivateModal = () => {
        modal.classList.remove('active')
        overlay.classList.remove('active')
    };

    const deactivateDetails = () => {
        details.classList.remove('active')
        overlay.classList.remove('active')
    };

    return {activateModal, deactivateModal, deactivateDetails};
})();

//Delete a project

const DeleteButtonProject = (() => {
    const containerProjects = document.querySelector('.content');
    
    containerProjects.addEventListener('click', (e) => {
        if (e.target.classList[0] === 'project-delete') {
            const projectID = e.target.parentNode.id;
            DeleteProject(projectID);
        }
    });
})();

//filter priority 

const PriorityCheckbox = (() => {
    const prio = document.querySelectorAll('.priority-filter input');

    prio.forEach(element => {
        element.addEventListener('change', (e) => {
            const input = e.target.classList.value;
            const pageTitle = document.querySelector('.page-title').id;
            const button = document.querySelector(`#${input}-filter`);
            if (button.checked) {
                settings.filterPriority.push(input);
                Storage.updateList('userSettings', settings);
                Clean(pageTitle);
            } else  {
                let idx = settings.filterPriority.indexOf(input);
                if (idx != -1) settings.filterPriority.splice(idx, 1);
                Storage.updateList('userSettings', settings);
                Clean(pageTitle);
            }   
        });
    });

     const createOptionElements = () => {                
        for (let priority of settings.filterPriority) {
            document.getElementById(`${priority}-filter`).setAttribute('checked', '')
        };
    };      
    return { createOptionElements };
})(); 

//filter projects 

const PriorityProjects = () => {
    const prio = document.querySelectorAll('.projects-filter input');
    prio.forEach(element => {
        element.addEventListener('change', (e) => {
            const input = e.target.id;
            const pageTitle = document.querySelector('.page-title').id;
            const button = document.getElementById(input);
            if (button.checked) {
                settings.filterProjects.push(input);
                Storage.updateList('userSettings', settings);
                Clean(pageTitle);
            } else {
                let idx = settings.filterProjects.indexOf(input);
                if (idx != -1) settings.filterProjects.splice(idx, 1);
                Storage.updateList('userSettings', settings);
                Clean(pageTitle);
            }   
        });
    });

     const createOptionElements = () => {                
        for (let project of settings.filterProjects) {
            document.getElementById(`${project}`).setAttribute('checked', '');
        };
    };      
    return { createOptionElements };
};

//Darkmode 

const DarkMode = (() => {
    let darkMode = localStorage.getItem('darkMode');
    const toggle = document.querySelector('.style-toggle .icon')

    const enableDarkMode = () => {
        document.body.classList.add('darkmode');
        localStorage.setItem('darkMode', 'enabled')
    };

    if (darkMode === 'enabled') {
        enableDarkMode();
      };
      
    const disableDarkMode = () => {
        document.body.classList.remove('darkmode');
        localStorage.setItem('darkMode', 'disabled')
    };

    toggle.addEventListener('click', () => {
        darkMode = localStorage.getItem('darkMode'); 
        if (darkMode !== 'enabled') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

})();

export { MenuEvents, CreateItem, MarkToDo, DeleteItem, CreateDetailView, OptionController, ModalController, Submit, DeleteButtonProject, PriorityCheckbox, PriorityProjects }
