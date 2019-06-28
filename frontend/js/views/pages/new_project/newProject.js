import Utils from '../../../helpers/utils.js';
import Component from '../../../views/component.js';
import Project from '../../../models/project.js';

class NewProject extends Component {
    constructor() {
        super();

        this.model = new Project();
        this.settings = {};
        this.textArea = '';
    }

    render() {
        return new Promise((resolve, reject) => {
            let html;

            if (this.request.id) {
                this.model.getProject(this.request.id).then(project => {
                this.project = project;
                this.settings = project.service;

                if (this.project) {
                    html = `
                        <div class="project-container">
                            ${this.project.template}
                        </div>
                        <div class="management-container">
                            <form>
                                <div>
                                    <div><p><input class="project-add__header" type="checkbox" value="1"> Add Header</p></div>
                                </div>
                                <div>
                                    <div><p><input class="project-add__bodyMain" type="checkbox" value="1"> Add Body</p></div>
                                </div>
                                <p>Main area columns</p>
                                <div class="project-add__body">
                                    <div class="project-add__body-checkboxs">
                                        <p><input class="project-add__bodyBox" type="checkbox" value="1" disabled>1</p>
                                        <p><input class="project-add__bodyBox" type="checkbox" value="2" disabled>2</p>
                                        <p><input class="project-add__bodyBox" type="checkbox" value="3" disabled>3</p>
                                        <p><input class="project-add__bodyBox" type="checkbox" value="4" disabled>4</p>
                                    </div>
                                </div>
                                <div>
                                    <div><p><input class="project-add__footer" type="checkbox" value="1"> Add Footer</p></div>
                                </div>
                                <div class="project-add">
                                    <input class="project-add__title" type="text" placeholder="${this.project.title || 'Project title'}">
                                    <textarea class="project-add__description" placeholder="Project description">${this.project.description}</textarea>
                                    <button class="project-add__btn-add button" disabled>Add Project</button>
                                </div>
                            </form>
                        </div>
                        `;
                } else {
                    html = new Error404().render();
                }

                resolve(html);
            }).catch(error => {
                reject(error);
            });

            } else {

                resolve(`
                    <div class="project-container">
                        <h3>New Template Design</h3>
                    </div>
                    <div class="management-container">
                        <form>
                            <div>
                                <div><p><input class="project-add__header" type="checkbox" value="1"> Add Header</p></div>
                            </div>
                            <div>
                                <div><p><input class="project-add__bodyMain" type="checkbox" value="1"> Add Body</p></div>
                            </div>
                            <p>Main area columns</p>
                            <div class="project-add__body">
                                <div class="project-add__body-checkboxs">
                                    <p><input class="project-add__bodyBox" type="checkbox" value="1" disabled>1</p>
                                    <p><input class="project-add__bodyBox" type="checkbox" value="2" disabled>2</p>
                                    <p><input class="project-add__bodyBox" type="checkbox" value="3" disabled>3</p>
                                    <p><input class="project-add__bodyBox" type="checkbox" value="4" disabled>4</p>
                                </div>
                            </div>
                            <div>
                                <div><p><input class="project-add__footer" type="checkbox" value="1"> Add Footer</p></div>
                            </div>
                            <div class="project-add">
                                <input class="project-add__title" type="text" placeholder="Project title">
                                <textarea class="project-add__description" placeholder="Project description"></textarea>
                                <button class="project-add__btn-add button" disabled>Add Project</button>
                            </div>
                        </form>
                    </div>
                `);
            }
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const projectContainer = document.querySelector('.project-container'),
            insideProjectContainer = projectContainer.children,
            managementContainer = document.querySelector('.management-container'),
            addHeaderTemplate = document.querySelector('.project-add__header'),
            addBodyMainTemplate = document.querySelector('.project-add__bodyMain'),
            addBodyTemplate = document.getElementsByClassName('project-add__bodyBox'),
            addFooterTemplate = document.querySelector('.project-add__footer'),
            addProjectTitle = document.querySelector('.project-add__title'),
            addProjectDescription = document.querySelector('.project-add__description'),
            addProjectBtn = document.querySelector('.project-add__btn-add');

        if (this.project) {
            this.setPreferences(addHeaderTemplate, addFooterTemplate, addBodyMainTemplate, addBodyTemplate);
        }

        addProjectTitle.addEventListener('keyup', () => addProjectBtn.disabled = !addProjectTitle.value.trim());

        managementContainer.addEventListener('click', event => {
            const target = event.target;

            switch (target) {
                case addHeaderTemplate:
                    this.addRemoveHeader(projectContainer, insideProjectContainer, addHeaderTemplate);
                    break;

                case addFooterTemplate:
                    this.addRemoveFooter(projectContainer, insideProjectContainer, addFooterTemplate);
                    break;

                case addBodyMainTemplate:
                    this.addRemoveBody(projectContainer, insideProjectContainer, addBodyMainTemplate, addBodyTemplate);
                    break;

                case addBodyTemplate[0]:
                case addBodyTemplate[1]:
                case addBodyTemplate[2]:
                case addBodyTemplate[3]:
                    this.editBody(target, addBodyTemplate);
                    break;

                case addProjectBtn:
                    this.saveProject(addProjectTitle, addProjectDescription, projectContainer, addBodyTemplate);
                    break;
            }
        });

        managementContainer.addEventListener('blur', event => {
            const target = event.target;

            if (/^(field-project-add__)/.test(target.getAttribute('class'))) {
                const className = target.getAttribute('class'),
                area = projectContainer.querySelector(`.template-${className.slice(19).match(/^(\w{1,8})/g)[0]}-${className.match(/\d{1}$/g)[0]}`),
                property = className.match(/(\-)(\D{1,6})(-)/g)[0].slice(1, -1);

                if (property === 'width') {
                    const tempWidth = area.offsetWidth;
                    area.style.width = `${target.value}%`;

                    area.style.width = (area.offsetWidth > area.parentNode.offsetWidth) ? `${tempWidth}px`: `${target.value}%`;

                } else {
                    const tempHeight = area.offsetHeight;
                    area.style.height = `${target.value}%`;

                    area.style.height = (area.offsetHeight > area.parentNode.offsetHeight) ? `${tempHeight}px` : `${target.value}%`;
                }
            }
        }, true);

        projectContainer.onclick = event => {
            const target = event.target;

            if (target.tagName === 'H1' || target.tagName === 'H2') {
                this.editText(target);
            }
        };

        projectContainer.addEventListener('blur', () => {event.target.parentNode.innerHTML = this.textArea.children[0].value}, true);
    }

    setPreferences(addHeaderTemplate, addFooterTemplate, addBodyMainTemplate, addBodyTemplate) {

        for (let key in this.project.service) {

            eval(`${key}.checked = ${this.project.service[key]}`);

            (key === 'addBodyMainTemplate') && this.changeChecked(addBodyMainTemplate, addBodyTemplate);

            if (this.project.service[key] === true) {

                this.addInputField( eval(`${key}.getAttribute('class')`), eval(`${key}.value`) );
            }
        }
    }

    addRemoveHeader(projectContainer, insideProjectContainer, addHeaderTemplate) {
        const heder = document.createElement('div');
        heder.setAttribute('class', 'template-header-1');
        heder.innerHTML = `
                        <h2>Title Header</h2>
                        <h1>Block Header</h1>
        `;

        if (addHeaderTemplate.checked && insideProjectContainer[0]['tagName'] === 'H3') {
            projectContainer.replaceChild(heder, insideProjectContainer[0]);
            this.addInputField('project-add__header', 1);

        } else if (addHeaderTemplate.checked && insideProjectContainer[0]['tagName'] != 'H3') {
            projectContainer.insertBefore(heder, insideProjectContainer[0]);
            this.addInputField('project-add__header', 1);

        } else if (!addHeaderTemplate.checked && insideProjectContainer.length === 1) {
            projectContainer.innerHTML = `
                                        <h3>New Template Design</h3>
            `;
            this.removeInputField('field-project-add__header');

        } else {
            projectContainer.removeChild(document.querySelector('.template-header-1'));
            this.removeInputField('field-project-add__header');
        }

        this.settings['addHeaderTemplate'] = addHeaderTemplate.checked;
    }

    addRemoveFooter(projectContainer, insideProjectContainer, addFooterTemplate) {
        const footer = document.createElement('div');
        footer.setAttribute('class', 'template-footer-1');
        footer.innerHTML = `
                        <h2>Title Footer</h2>
                        <h1>Block Footer</h1>
        `;

        if (addFooterTemplate.checked && insideProjectContainer[0]['tagName'] === 'H3') {
            projectContainer.replaceChild(footer, insideProjectContainer[0]);
            this.addInputField('project-add__footer', 1);

        } else if (addFooterTemplate.checked && insideProjectContainer[0]['tagName'] != 'H3') {
            projectContainer.appendChild(footer);
            this.addInputField('project-add__footer', 1);

        } else if (!addFooterTemplate.checked && insideProjectContainer.length === 1) {
            projectContainer.innerHTML = `
                                        <h3>New Template Design</h3>
            `;
            this.removeInputField('field-project-add__footer');

        } else {
            projectContainer.removeChild(document.querySelector('.template-footer-1'));
            this.removeInputField('field-project-add__footer');
        }

        this.settings['addFooterTemplate'] = addFooterTemplate.checked;
    }

    addRemoveBody(projectContainer, insideProjectContainer, addBodyMainTemplate, addBodyTemplate) {
        const containerLength = insideProjectContainer.length,
            body = document.createElement('div');

        body.setAttribute('class', 'template-bodyMain-1');
        body.innerHTML = `<h1>Block Body</h1>`;

        if (addBodyMainTemplate.checked && insideProjectContainer[0]['tagName'] === 'H3') {
            projectContainer.replaceChild(body, insideProjectContainer[0]);
            this.addInputField('project-add__bodyMain', 1);

        } else if (addBodyMainTemplate.checked && insideProjectContainer[0]['tagName'] != 'H3') {

            if (insideProjectContainer[containerLength - 1].getAttribute('class') === 'template-footer-1') {
                projectContainer.insertBefore(body, insideProjectContainer[containerLength - 1]);

            } else {
                projectContainer.appendChild(body);
            }

            this.addInputField('project-add__bodyMain', 1);

        } else if (!addBodyMainTemplate.checked && containerLength === 1) {
            projectContainer.innerHTML = `
                                        <h3>New Template Design</h3>
            `;
            this.removeInputField('field-project-add__bodyMain', 'field-project-add__bodyBox');

        } else {
            projectContainer.removeChild(document.querySelector('.template-bodyMain-1'));
            this.removeInputField('field-project-add__bodyMain', 'field-project-add__bodyBox');
        }

        this.settings['addBodyMainTemplate'] = addBodyMainTemplate.checked;

        this.changeChecked(addBodyMainTemplate, addBodyTemplate);
    }

    editBody(addBodyBoxTemplate, addBodyTemplate) {
        const lastBody = document.querySelector('.template-bodyMain-1');

        this.changeChecked(addBodyBoxTemplate, addBodyTemplate);

        this.removeInputField('field-project-add__bodyBox');

        if (addBodyBoxTemplate.checked) {
            lastBody.innerHTML = '';

            for (let i = 1; i <=  addBodyBoxTemplate.value; i++) {
                const column = document.createElement('div');
                column.setAttribute('class', `template-bodyBox-${i}`);
                column.innerHTML = `
                                <h2>Title Column ${i}</h2>
                                <h1>Column${i}</h1>
                `;
                lastBody.appendChild(column);
            }

            this.addInputField('project-add__bodyBox', addBodyBoxTemplate.value);

        } else {
            lastBody.innerHTML = `<h1>Block Body</h1>`;
        }

        this.settings.amountBodyBoxTemplate = `${addBodyBoxTemplate.value - 1}`;
        this.settings.valueBodyBoxTemplate = addBodyBoxTemplate.checked;
    }

    // The method sets the checkbox control logic for adding parts of the main template area.

    changeChecked(checkboxChecked, addBodyTemplate) {

        for (let i = 0; i <= 3; i++) {

            if (!checkboxChecked.checked && checkboxChecked.classList.contains('project-add__bodyMain')) {
                addBodyTemplate[i].disabled = true;

            } else {
                addBodyTemplate[i].disabled = false;
            }

            if (checkboxChecked != addBodyTemplate[i]) {
                addBodyTemplate[i].checked = false;
            }
        }
    }

    // The method adds input fields for the sizes of template areas.

    addInputField(className, value) {
        const fieldTitle = document.createElement('div');
        fieldTitle.setAttribute('class', `field-${className}`);
        fieldTitle.innerHTML = `
                            <div><h2>Block width</h2>
                            <h2>Block height</h2></div>
        `;
        document.querySelector(`.${className}`).parentNode.parentNode.parentNode.appendChild(fieldTitle);

        for (let i = 1; i <= value; i++) {
            const projectContainerWidth = document.querySelector('.project-container').offsetWidth,
                projectContainerHeight = document.querySelector('.project-container').offsetHeight,
                blockSelector = document.querySelector(`.template-${className.slice(13)}-${i}`),
                blockSelectedWidth = Math.round(100 * (blockSelector.offsetWidth + 10)/ projectContainerWidth),
                blockSelectedHeight = Math.round(100 * (blockSelector.offsetHeight + 4)/ projectContainerHeight),
                fieldsEntry = document.createElement('div');

            fieldsEntry.innerHTML = `
                                <p>${i} <input class="field-${className}-width-${i}" value="${blockSelectedWidth}"> %</p>
                                <p>${i} <input class="field-${className}-height-${i}" value="${blockSelectedHeight}"> %</p>
            `;
            fieldTitle.appendChild(fieldsEntry);
        }
    }

    // The method removes the input fields for the sizes of the template areas.

    removeInputField(...classNames) {
        
        for (let className of classNames) {
            document.getElementsByClassName(className).length && document.querySelector(`.${className}`).remove();
        }
    }

    // A method for editing headings and content of template areas.

    editText(area) {
        this.textArea = area;
        area.innerHTML = `<input type="text" value="${area.innerText}">`;
        area.getElementsByTagName('input')[0].focus();
        area.getElementsByTagName('input')[0].selectionStart = area.children[0].value.length;
    }

    saveProject(addProjectTitle, addProjectDescription, projectContainer, addBodyTemplate) {

        if ('addBodyMainTemplate' in this.settings && this.settings['addBodyMainTemplate'] === true) {
            this.settings[`addBodyTemplate[${this.settings.amountBodyBoxTemplate}]`] = this.settings.valueBodyBoxTemplate;
        }

        if ('amountBodyBoxTemplate' in this.settings) {
            delete this.settings['amountBodyBoxTemplate'];
        }

        if ('valueBodyBoxTemplate' in this.settings) {
            delete this.settings['valueBodyBoxTemplate'];
        }

        const newProject = {
            title: addProjectTitle.value.trim(),
            status: '',
            date: Utils.getTime(),
            description: addProjectDescription.value.trim(),
            template: projectContainer.innerHTML,
            service: this.settings
        };

        this.model.addProject(newProject);
        this.resetSettingsProject(addBodyTemplate);
    }

    resetSettingsProject(addBodyTemplate) {
        this.removeInputField('field-project-add__header', 'field-project-add__bodyMain', 'field-project-add__bodyBox', 'field-project-add__footer');

        document.querySelector('.project-container').innerHTML = `<h3>New Template Design</h3>`;
        document.querySelector('.project-add__header').checked = false;
        document.querySelector('.project-add__bodyMain').checked = false;
        document.querySelector('.project-add__footer').checked = false;
        document.querySelector('.project-add__title').value = '';
        document.querySelector('.project-add__description').value = '';
        document.querySelector('.project-add__btn-add').disabled = true;
        this.settings = {};

        for (let i = 0; i <= 3; i++) {
            addBodyTemplate[i].checked = false;
            addBodyTemplate[i].disabled = true;
        }
    }
}

export default NewProject;