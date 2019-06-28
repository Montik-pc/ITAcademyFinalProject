import Component from '../../views/component.js';

class Footer extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`
                <footer class="footer">                   
                    <p class="footer_info">
                        Developed under the course "Developing Web Applications in JavaScript", 2019
                    </p>                  
                </footer>
            `);
        });
    }
}

export default Footer;