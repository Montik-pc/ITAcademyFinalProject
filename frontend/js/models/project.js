class Project {
    getProjectsList() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', 'http://localhost:3000/api/projects', true);

            xhr.onload = function () {

                try {
                    resolve(JSON.parse(xhr.response));
                }        
                catch (error) {
                    console.log(error.name + ': ' + error.message);
                    reject(error);
                }
            };

            xhr.send();
        });
    }

    addProject(newProject) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', 'http://localhost:3000/api/projects', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = () => resolve(JSON.parse(xhr.response));
            xhr.send(JSON.stringify(newProject));
        });
    }

    getProject(id) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', `http://localhost:3000/api/projects/${id}`, true);

            xhr.onload = () => {
                
                try {
                    resolve(JSON.parse(xhr.response));
                 }        
                catch (error) {
                    console.log(error.name + ': ' + error.message);
                    reject(error);
                }
            };

            xhr.send();
        });
    }

    editProject(updatedProject) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('PUT', `http://localhost:3000/api/projects/${updatedProject.id}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = () => resolve();

            xhr.send(JSON.stringify(updatedProject));
        });
    }

    changeProjectStatus(id) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('PUT', `http://localhost:3000/api/projects/${id}/done`, true);

            xhr.onload = () => resolve();

            xhr.send();
        });
    }

    removeProject(id) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('DELETE', `http://localhost:3000/api/projects/${id}`, true);

            xhr.onload = () => resolve();

            xhr.send();
        });
    }

    removeAllProjects() {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('DELETE', `http://localhost:3000/api/projects`, true);

            xhr.onload = () => resolve();

            xhr.send();
        });
    }
}

export default Project;