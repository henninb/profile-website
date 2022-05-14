// const navToggle = document.querySelector('.nav-toggle');
// const navLinks = document.querySelectorAll('.nav__link')

// navToggle.addEventListener('click', () => {
//     document.body.classList.toggle('nav-open');
// });

// navLinks.forEach(link => {
//     link.addEventListener('click', () => {
//         document.body.classList.remove('nav-open');
//     })
// })


let menuToggle = document.querySelector(".menuToggle");
let navigation = document.querySelector(".navigation");
    menuToggle.onclick = function () {
      navigation.classList.toggle("active");
    };
