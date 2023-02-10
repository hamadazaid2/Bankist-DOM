'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnLearnMore = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const sec1coord = section1.getBoundingClientRect();

const tabs = document.querySelectorAll('.operations__tab');
const operationContents = document.querySelectorAll('.operations__content ');
const tabContainer = document.querySelector('.operations__tab-container');



// Open Modal
const openModal = function (e) {
  // When href of (a) is #, the defalt is that the page scrolled to the top
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};


// Close Modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

for (let i = 0; i < btnsOpenModal.length; i++)

  btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling 
btnLearnMore.addEventListener('click', function () {
  window.scrollTo({
    left: sec1coord.left + window.pageXOffset,
    top: sec1coord.top + window.pageYOffset,
    behavior: 'smooth'
  });
})

// section1.scrollIntoView({ behavior: 'smooth' });

// Page navigation 
// Here i will use the benifit of bubbiling 


// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  e.target;
  console.log(e.target);
  // Matching Strategy 
  if (e.target.classList.contains('nav__link')) {
    const secID = e.target.getAttribute('href');
    console.log(secID);
    document.querySelector(secID).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tab


tabContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('operations__tab')) {
    // <<<<<<<<<<<<<<<< MY SOLUTION >>>>>>>>>>>>>>>
    // Which is better than john code
    /**
     * <<<<<<<<<<<< TAB >>>>>>>>>>>>>
     * get data-tab attribute value 
     * Since there is no more than one operatines_tab displyed in the page, Search for the only active operations_tab which contains (operations__tab--active) and deactive it
     * search for  operations_content--${data-tab} and put a remove operations_content and add operations_content--active
     * <<<<<<<<<<<< CONTENT >>>>>>>>>>>
     * Since there is no more than one operatines_container displyed in the page, Search for the only active operations_container which contains (operations__container--active) and deactive it
     * search for operations__content--${data-tab} and add operations__content--active to it
     */
    const tabBtn = e.target.closest('.operations__tab');
    const dataTab = tabBtn.dataset.tab;
    // Operations Tab
    document.querySelector('.operations__tab--active').classList.replace('operations__tab--active', 'operations__tab');
    document.querySelector(`.operations__tab--${dataTab}`).classList.add('operations__tab--active');

    // Operations Content 
    document.querySelector('.operations__content--active').classList.replace('operations__content--active', 'operations__content');
    document.querySelector(`.operations__content--${dataTab}`).classList.add('operations__content--active');
  }

  // <<<<<<<<<<<<< JOHN CODE >>>>>>>>>>>>>>>>>
  // tabsContainer.addEventListener('click', function (e) {
  //   const clicked = e.target.closest('.operations__tab');

  //   // Guard clause
  //   if (!clicked) return;

  //   // Remove active classes
  //   tabs.forEach(t => t.classList.remove('operations__tab--active'));
  //   tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //   // Activate tab
  //   clicked.classList.add('operations__tab--active');

  //   // Activate content area
  //   document
  //     .querySelector(`.operations__content--${clicked.dataset.tab}`)
  //     .classList.add('operations__content--active');
  // });
});


const nav = document.querySelector('.nav');
const handleNavHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const logo = nav.querySelector('.nav__logo');
    nav.querySelectorAll('.nav__link').forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// // First solution 
// nav.addEventListener('mouseover', function (e) {handleNavHover(e, 0.5)});
// nav.addEventListener('mouseout', function (e) {handleNavHover(e, 1)});

// Second solution
nav.addEventListener('mouseover', handleNavHover.bind(0.5));
nav.addEventListener('mouseout', handleNavHover.bind(1));

// Sticky nav bar 

// Bad Performance => Don't use
window.addEventListener('scroll', function () {
  const initialCoords = section1.getBoundingClientRect();
  window.screenY > initialCoords.top ? nav.classList.add('sticky') : nav.classList.remove('sticky');
});

// Best Solution 
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy img loading
const allImgs = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
allImgs.forEach(img => imgObserver.observe(img));


const slider = function () {
  // Slider 
  const allSlides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  // For best view when working and then will be deleted
  const slider = document.querySelector('.slider');
  let curSlide = 0;
  const maxSlides = allSlides.length;
  // slider.style.transform = `scale(0.4) translateX(-800px)`;
  slider.style.overflow = 'visible';
  allSlides.forEach((slide, i) => {
    slide.style.transform = `translateX(${i * 110}%)`
  });

  // Display Slide according of the clicked dot 
  /**
   * Select the data-slide 
   * Edit the curSlide and put it to curSlide = data-slide + 1; to inkove the prevSlide function OR  put it to curSlide = data-slide - 1; to inkove the nextSlide function
   * Finally inkove the next of previous slide function
   *  */

  const handleDotActivation = function (slide) {

    // First Solution
    // Deactive previous dot and Active the current slide dot

    // DeActive the previous active silde 
    // Since there is no more than one dot is active at time so i can select it and replace the active class to unactive

    // document.querySelector('.dots__dot--active').classList.replace('dots__dot--active', 'dots__dot');
    // const dotBtns = document.querySelectorAll('button[data-slide]').forEach(btn => {
    //   if (+(btn.dataset.slide) === curSlide) {
    //     btn.classList.add('dots__dot--active');
    //   }
    // });

    // Second Solution 
    const dotBtns = document.querySelectorAll('button[data-slide]');
    // remove dots__dot--active from all dotbtns
    dotBtns.forEach(btn => btn.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    curSlide = slide;
    allSlides.forEach((slide, i) => {
      slide.style.transform = `translateX(${110 * (i - curSlide)}%)`
    });
  }
  const nextSlide = function () {
    curSlide++;
    if (curSlide === maxSlides) curSlide = 0;
    goToSlide(curSlide);
    handleDotActivation(curSlide);
  };
  const prevSlide = function () {
    curSlide--;
    if (curSlide === -1) curSlide = maxSlides - 1;
    goToSlide(curSlide);
    handleDotActivation(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    console.log(e.code);
    if (e.code === 'ArrowRight') nextSlide();
    if (e.code === 'ArrowLeft') prevSlide();
  });

  // Dots
  const dots = document.querySelector('.dots');
  const createDots = function () {
    allSlides.forEach((_, i) => {
      const dot = `<button class ="dots__dot" data-slide="${i}""></button>`;
      dots.insertAdjacentHTML('beforeend', dot);
    });
  };


  // Display Slide when click to dot

  dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // // Select data-slide
      const dotSlideNum = +(e.target.dataset.slide); // + == parseInt
      // // console.log(dotSlideNum);
      // curSlide = dotSlideNum + 1;
      goToSlide(dotSlideNum);
      handleDotActivation(dotSlideNum);
    }
  });

  const init = function () {
    createDots();
    handleDotActivation(0);
    goToSlide(0);
  };
  init();

};

slider();

// Lifecycle DOM Events
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });