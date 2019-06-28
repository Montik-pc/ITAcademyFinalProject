import Component from '../../../views/component.js';
import Project from '../../../models/project.js';

class ProjectsList extends Component {
    constructor() {
        super();

        this.model = new Project();
    }

    render() {
        return new Promise((resolve, reject) => {
            this.model.getProjectsList().then(projects => {
                this.projects = projects;

                resolve(`
                    <div class="content-container-filling">
                        <h3>Download the template below</h3>
                        <div class="projects">
                            <div class="projects__heading">
                                <a class="project__heading-title"><i>↕ </i>Title</a>
                                <a class="project__heading-date"><i>↕ </i>Date</a>
                                <a class="project__heading-status"><i>↕ </i>Status</a>
                                <div class="project__buttons">
                                    <button class="projects__btn-clear button" ${!this.projects.length ? 'disabled' : ''}>Clear projects List</button>
                                </div>
                            </div>
                            <div class="projects__list">
                                ${this.projects.map(project => this.getProjectHTML(project)).join('\n ')}
                            </div>
                        </div>
                    </div>
                `);
            }).catch(error => {
                reject(error);
            });
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const projectsContainer = document.querySelector('.projects'),
            titleProject = projectsContainer.querySelector('.project__heading-title'),
            dateProject = projectsContainer.querySelector('.project__heading-date'),
            statusProgect = projectsContainer.querySelector('.project__heading-status'),
            clearProjectsListBtn = projectsContainer.querySelector('.projects__btn-clear'),
            projectsList = projectsContainer.querySelector('.projects__list');

        projectsContainer.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            switch (target) {
                case titleProject:
                    this.sortProjects('title', projectsList, titleProject);
                    break;

                case dateProject:
                    this.sortProjects('date', projectsList, dateProject);
                    break;

                case statusProgect:
                    this.sortProjects('status', projectsList, statusProgect);
                    break;
            }

            if (targetClassList.contains('projects__btn-clear')) {
                this.clearProjectsList(projectsList, clearProjectsListBtn);
            }

            if (targetClassList.contains('project') || targetClassList.contains('project__title')) {
                this.redirectToProjectInfo(target.dataset.id);
            }

            if (targetClassList.contains('project__btn-done')) {
                this.changeProjectStatus(target.parentNode.parentNode, target);
            }

            if (targetClassList.contains('project__btn-remove')) {
                this.removeProject(target.parentNode.parentNode, projectsList, clearProjectsListBtn);
            }
        });
    }

    getProjectHTML(project) {
        const statusDone = project.status === 'Done';

        return `
            <div class="project ${statusDone ? 'project_done' : ''}" data-id="${project.id}">
                <a class="project__title" data-id="${project.id}" title="${project.description}">${project.title}</a>
                <a class="project__title" data-id="${project.id}" title="${project.description}">${project.date}</a>
                <a class="project__title" data-id="${project.id}">${project.status}</a>
                <div class="project__buttons">
                    ${!statusDone ?
                        `<a class="project__btn-done button">Project completed</a>`
                    : ''}
                    <a class="project__btn-edit button" href="#/loading/${project.id}">Edit</a>
                    <a class="project__btn-remove button">Remove</a>   
                </div>                            
            </div>
        `;
    }

    clearProjectsList(projectsList, clearProjectsListBtn) {
        if (confirm('Are you sure?')) {
            this.model.removeAllProjects().then(() => {
                clearProjectsListBtn.disabled = true;
                projectsList.innerHTML = '';
            });
        }
    }

    redirectToProjectInfo(id) {
        location.hash = `#/loading/${id}`;
    }

    changeProjectStatus(projectContainer, doneProjectBtn) {
        this.model.changeProjectStatus(projectContainer.dataset.id).then(() => {
            projectContainer.classList.add('project_done') && doneProjectBtn.remove();
            projectContainer.children[2].innerHTML = `Done`;
        });

        this.projects.forEach((project) => {

            if (project.id === projectContainer.dataset.id) {
                project.status = 'Done';
            }
        });
        projectContainer.querySelector('.project__btn-done.button').remove();
    }

    removeProject(projectContainer, projectsList, clearProjectsListBtn) {
        if (confirm('Are you sure?')) {
            this.model.removeProject(projectContainer.dataset.id).then(() => {
                projectContainer.remove();
                !projectsList.children.length && (clearProjectsListBtn.disabled = true);
            });

            this.projects.forEach((project, i, template) => project.id === projectContainer.dataset.id && template.splice(i, 1));
        }
    }

    sortProjects(property, projectsList, propertySorting) {
        const pointers = projectsList.parentNode.getElementsByTagName('i');

        if (propertySorting.children[0].outerText === '↕ ' || propertySorting.children[0].outerText === '↑ ') {
            this.projects.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));
            this.cycle(pointers, 2);
            propertySorting.children[0].innerHTML = `↓ `;

        } else {
            this.projects.sort((a, b) => (a[property] < b[property]) ? 1 : ((b[property] < a[property]) ? -1 : 0));
            this.cycle(pointers, 2);
            propertySorting.children[0].innerHTML = `↑ `;
        }

        projectsList.innerHTML = `${this.projects.map(project => this.getProjectHTML(project)).join('\n ')}`;
    }

    cycle(pointers, length) {
        for (let i = 0; i <= length; i++) {
            pointers[i].innerHTML = '↕ ';
        }
    }
}

export default ProjectsList;