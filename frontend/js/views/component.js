import Utils from '../helpers/utils.js';

class Component {
    constructor() {
        this.request = Utils.parseRequestURL();
    }

    afterRender() {}
}

export default Component;