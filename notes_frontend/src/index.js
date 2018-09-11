console.log('sup')
document.addEventListener('DOMContentLoaded', () => {
    const endPoint = 'http://localhost:3000/api/v1/notes';
    fetch(endPoint)
        .then(res => res.json())
        .then(json => console.log(json));
});