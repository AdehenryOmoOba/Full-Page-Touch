const slider = document.querySelector(".slide-container");
const slides = Array.from(document.querySelectorAll(".slide"));

// State properties

let isDragging = false;
startPos = 0;
currentTranslate = 0;
previousTranslate = 0;
animationID = 0;
currentIndex = 0;

/////////////////////////////////////////

slides.forEach((slide, index) => {
  const images = slide
    .querySelector("img")
    .addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

  // Touch event (for mobile devices)
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);

  // Mouse event (for PCs)
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mouseleave", touchEnd);
  slide.addEventListener("mousemove", touchMove);
});

// Deactivate right-click menu
window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
};

// Dynamically determine current position on X-axis
function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function touchStart(index) {
  return function (event) {
    currentIndex = index;
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    slider.classList.add("grabbing");
  };
}

function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);
  const movedBy = currentTranslate - previousTranslate;
  if (movedBy < -100 && currentIndex < slides.length - 1)
    currentIndex = currentIndex + 1;
  if (movedBy > 100 && currentIndex > 0) currentIndex = currentIndex - 1;
  setPositionByIndex();
  slider.classList.remove("grabbing");
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = previousTranslate + currentPosition - startPos;
  }
}

function animation() {
  setSliderPositon();
  if (isDragging) requestAnimationFrame(animation);
}

function setSliderPositon() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  previousTranslate = currentTranslate;
  setSliderPositon();
}
