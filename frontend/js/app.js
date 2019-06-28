import Utils from './helpers/utils.js';

import Header from './views/partials/header.js';
import Footer from './views/partials/footer.js';

import About from './views/pages/about.js';
import Error404 from './views/pages/error404.js';

import NewProject from './views/pages/new_project/newProject.js';
import ProjectsList from './views/pages/loading/projectsList.js';

const Routes = {
    '/': About,
    '/new_project': NewProject,
    '/loading': ProjectsList,
    '/loading/:id': NewProject
};

function router() {
    const headerContainer = document.getElementsByClassName('header-container')[0],
          contentContainer = document.getElementsByClassName('content-container')[0],
          footerContainer = document.getElementsByClassName('footer-container')[0],
          header = new Header(),
          footer = new Footer();

    header.render().then(html => {
        headerContainer.innerHTML = html;
        header.afterRender();
    });

    const request = Utils.parseRequestURL(),
        parsedURL = `/${request.resource || ''}${request.id ? '/:id' : ''}${request.action ? `/${request.action}` : ''}`,
        page = Routes[parsedURL] ? new Routes[parsedURL]() :  new Error404();

    page.render().then(html => {
        contentContainer.innerHTML = html;
        page.afterRender(request.id);
    }).catch(error => {
        contentContainer.innerHTML = `<div class="content-container-error">Unexpected Error: ${error.message}</div>`;
    });

    footer.render().then(html => {
        footerContainer.innerHTML = html;
        footer.afterRender();
    });
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);