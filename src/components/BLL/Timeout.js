//Timeout to wait for 1 second after receiving data
export default function timeout(time) {
    return new Promise((resolve, reject) => {
        if (time < 0) return reject(new Error("Time can't be less than 0"));
        return setTimeout(resolve, time);
    });
}