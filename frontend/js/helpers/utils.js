class Utils {
    static parseRequestURL() {
        const url = location.hash.slice(1),
            request = {};

        [, request.resource, request.id, request.action] = url.split('/');

        return request;
    }

    static getTime() {
        const date = new Date(),
            time = `${addCapacity(date.getDate())}.${addCapacity(date.getMonth())}.${date.getFullYear()} ${addCapacity(date.getHours())}:${addCapacity(date.getMinutes())}:${addCapacity(date.getSeconds())}`;

        function addCapacity(arg) {
            return (arg > 9) ? `${arg}`: `0${arg}`;
        }

        return time;
    }
}

export default Utils;