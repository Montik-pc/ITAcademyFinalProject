import Utils from '../../helpers/utils.js';
import Component from '../../views/component.js';

class Header extends Component {
    render() {
        const resource = this.request.resource;

        return new Promise(resolve => {
            resolve(`
                <header class="header">
                    <a class="header__link ${resource === 'new_project' ? 'active' : ''}" href="/#/new_project">New project</a>
                    <a class="header__link ${resource === 'loading' ? 'active' : ''}" href="/#/loading">Download project</a>
                    <a class="header__link ${!resource ? 'active' : ''}" href="/#/">About</a>
                    <div class="header__time">
                        <h3>${Utils.getTime()}</h3>
                    </div>
                </header>
            `);
        });
    }

    afterRender() {
        const clock = document.getElementsByClassName('header__time')[0];

        setInterval(() => clock.innerHTML = `<h3>${Utils.getTime()}</h3>`, 1000);
	}
}

export default Header;