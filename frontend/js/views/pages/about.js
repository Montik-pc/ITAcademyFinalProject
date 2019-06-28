import Component from '../../views/component.js';

class About extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`
                <div class="content-container-filling">
                    <div class="about"> 
                        <h1 class="about__welcome">Welcome!</h1>                   
                        <p class="about__info">So, here is an application, where you can create templates for your web pages.<br>Enjoy!</p>
                        <a class="about__btn button" href="/#/new_project" title="Click here to start a new project!">New project</a>
                        <a class="about__btn button" href="/#/loading" title="Click here to download the project!">Download project</a>
                    </div>
                </div>
            `);
        });
    }
}

export default About;