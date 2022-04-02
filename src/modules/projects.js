import { Storage } from "./todo";

const Projects = () => {
    const content = document.querySelector('.content');
    const containerProjects = document.createElement('div');
    content.append(containerProjects);
    containerProjects.classList.add('container-projects')

    const clearTodos = (() => {
        document.querySelector('.to-do-container').classList.add('hide');
        document.querySelector('button.new-to-do').classList.add('hide');
    })();

    const newElement = (project, index) => {
        const projectItem = document.createElement('div');
        const title = document.createElement('div');
        const deleteProject = document.createElement('div');
   
        containerProjects.append(projectItem);
        projectItem.classList.add('project-item', project.toLowerCase().replace(/ .*/,''))
        projectItem.id = index;
        projectItem.append(title);
        title.classList.add('project-title');
        title.textContent = project;

        projectItem.append(deleteProject);
        deleteProject.classList.add('project-delete');
    };
    //Elements on DOM/projects subpage
    const createElements = (() => {
        settings.allProjects.forEach(function (project, index) {
            newElement(project, index)
        });
        const add = document.createElement('div');
        add.classList.add('add');
        content.append(add);
        const input = document.createElement('input');
        add.append(input);
        input.setAttribute('id', 'add');
        input.setAttribute('name', 'add');
        input.setAttribute('placeholder', 'Type a new project title..');
        const button = document.createElement('button');
        add.append(button)
        button.classList.add('add-project');
        button.textContent = 'Add';
    })();

    const addProject = (() => {
        const add = document.querySelector('.add-project');
        const input = document.querySelector('#add');
        const addInput = () => {
            if (input.value === '') {
                alert('Please enter a project name.');
            } else {
                newElement(input.value, settings.allProjects.length);
                settings.allProjects.push(input.value);
                if (settings.filterProjects.length > 0) {
                    settings.filterProjects.push(input.value);
                }
                Storage.updateList('userSettings', settings);
                input.value = '';
            }
        };

        add.addEventListener('click', (e) => {
            addInput();
        });
        input.addEventListener('keyup', (e) => {
            if(e.which === 13) {
                addInput();
            }
          });
    })();

    return { clearTodos, createElements };
};

//Elements on DOM overall (filter, add to-do & detail view)
const InitializeProjects = (() => {

    const cleanDropdown = (selectID) => {
        const select = document.querySelector(selectID);
        while (select.childNodes.length > 2) {
            select.removeChild(select.lastChild);
        }
    };

    const createDropdown = (project, selectID) => {
        const select = document.querySelector(selectID);
        const option = document.createElement('option');
        select.append(option)
        option.setAttribute('value', project.toLowerCase());
        option.textContent = project;
    };
    
    const createElements = () => {
        for (let project of settings.allProjects) {
            createDropdown(project, '#detail-projects');
            createDropdown(project, '#add-projects');
        };
    };
    
    const createOptionElements = () => {
        const filter = document.querySelector('.projects-filter');
        while (filter.childNodes.length > 1) {
            filter.removeChild(filter.firstElementChild);
        }
        
        for (let project of settings.allProjects) {
            const div = document.createElement('div');
            filter.append(div)
            const input = document.createElement('input');
            div.append(input);
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', project.toLowerCase());
            input.setAttribute('name', project.toLowerCase());
            const label = document.createElement('label');
            div.append(label);
            label.setAttribute('for', project.toLowerCase());
            label.textContent = project;
        };
    };

    return { cleanDropdown, createElements, createOptionElements };
})();

const DeleteProject = (projectID) => {
    let check = false;
    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].project.toLowerCase() === settings.allProjects[projectID].toLowerCase()) {
            check = true;
            break;
        }; 
    };
    if (check) {
        alert("You can't delete a project which is assigend to a to-do. You have to change or delete the to-do first.");
        check = false;
    } else {
        settings.allProjects.splice(projectID, 1);
        Storage.updateList('userSettings', settings);
        
        const containerProjects = document.querySelector('.container-projects');
        const add = document.querySelector('.add');
        containerProjects.remove();
        add.remove();
        Projects().createElements
    }
};


export  { Projects, InitializeProjects, DeleteProject };