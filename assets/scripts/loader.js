fetch('assets/banner.html')
    .then(res => res.text())
    .then(data => {document.getElementById('Banner').innerHTML = data}); 

fetch('assets/nav.html')
    .then(res => res.text())
    .then(data => {document.getElementById('Navigation').innerHTML = data}); 

fetch('assets/footer.html')
    .then(res => res.text())
    .then(data => {document.getElementById('Footer').innerHTML = data});
