// 전체페이지 스크롤 함수 구현
const backToTop = document.getElementById("backtotop");

// 스크롤 동작이 일어날 때 버튼 보여주기
function checkScroll() {
  let pageYOffset = window.pageYOffset;

  if (pageYOffset !== 0) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}

// 버튼을 누르면 화면 상단으로 올리기
function moveBackToTop() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

window.addEventListener("scroll", checkScroll);
backToTop.addEventListener("click", moveBackToTop);

// 강의 슬라이드 구현

// 오른쪽 버튼
function transformNext(event) {
  const slideNext = event.target;
  const slidePrev = slideNext.previousElementSibling;

  const classList = slideNext.parentElement.parentElement.nextElementSibling;
  let activeLi = classList.getAttribute("data-position");
  const liList = classList.getElementsByTagName("li");

  // 하나의 카드라도 왼쪽으로 이동했다면, 오른쪽으로 갈 수 있음
  if (Number(activeLi) < 0) {
    activeLi = Number(activeLi) + 260;

    // 왼쪽에 있던 카드가 오른쪽으로 갔다면, 다시 왼쪽으로 갈 수 있으므로 PREV버튼 활성화
    slidePrev.style.color = "#2f3059";
    slidePrev.classList.add("slide-prev-hover");
    slidePrev.addEventListener("click", transformPrev);

    // 맨 왼쪽에 현재 보이는 카드가 맨 첫번째 카드라면, 오른쪽으로 갈 수 없으므로 NEXT버튼 비활성화
    if (Number(activeLi) === 0) {
      slideNext.style.color = "#cfd8dc";
      slideNext.classList.remove("slide-next-hover");
      slideNext.removeEventListener("click", transformNext);
    }
  }

  classList.style.transition = "transform 1s";
  classList.style.transform = "translateX(" + String(activeLi) + "px)";
  classList.setAttribute("data-position", activeLi);
}

// 왼쪽 버튼
function transformPrev(event) {
  // 현재 클릭 이벤트를 받은 요소, 즉 slide-prv 클래스를 가진 요소
  const slidePrev = event.target;
  // slide-prev 클래스를 가진 요소 다음 요소는 slide-next 클래스를 가진 요소
  const slideNext = slidePrev.nextElementSibling;

  //ul 태그 선택
  const classList = slidePrev.parentElement.parentElement.nextElementSibling;
  let activeLi = classList.getAttribute("data-position");
  const liList = classList.getElementsByTagName("li");

  if (classList.clientWidth < liList.length * 260 + Number(activeLi)) {
    // 위치를 왼쪽으로 260이동
    activeLi = Number(activeLi) - 260;

    // 강의카드가 ul태그 너비보다 작으면 왼쪽버튼 비활성화
    if (classList.clientWidth > liList.length * 260 + Number(activeLi)) {
      slidePrev.style.color = "#cfd8dc";
      slidePrev.classList.remove("slide-prev-hover");
      slidePrev.removeEventListener("click", transformPrev);
    }

    slideNext.style.color = "#2f3059";
    slideNext.classList.add("slide-next-hover");
    slideNext.addEventListener("click", transformNext);
  }
  classList.style.transition = "transform 1s";
  classList.style.transform = "translateX(" + String(activeLi) + "px)";
  classList.setAttribute("data-position", activeLi);
}

// 강의카드와 화면 너비를 비교하여 버튼 출력
const slidePrevList = document.getElementsByClassName("slide-prev");

for (let i = 0; i < slidePrevList.length; i++) {
  // ul 태그 선택
  let classList =
    slidePrevList[i].parentElement.parentElement.nextElementSibling;
  let liList = classList.getElementsByTagName("li");

  // 강의카드가 ul태그 너비보다 넘치면, 왼쪽(prev)버튼은 활성화, 오른쪽(next)버튼은 현재 맨 첫 카드 위치이므로 비활성화
  if (classList.clientWidth < liList.length * 260) {
    slidePrevList[i].classList.add("slide-prev-hover");
    slidePrevList[i].addEventListener("click", transformPrev);
  } else {
    const arrowContainer = slidePrevList[i].parentElement;
    arrowContainer.removeChild(slidePrevList[i].nextElementSibling);
    arrowContainer.removeChild(slidePrevList[i]);
  }
}

// 강의카드 마우스효과 이벤트
let touchstartX;
let currentClassList;
let currentImg;
let currentActiveLi;
let nowActiveLi;
let mouseStart;

function processTouchMove(event) {
  // 해당 요소가 가진 고유동작 중단시키기
  event.preventDefault();
  // currentActiveLi: class-list 에서 data-position 으로 현재 카드 위치를 알아냄
  // touchstartX: 최초 요소의 x 좌표값
  // event.clientX: 드래그 중인 현재의 마우스 좌표값
  // event.touches[0].screenX : 터치의 좌표값
  let currentX = event.clientX || event.touches[0].screenX;
  nowActiveLi =
    Number(currentActiveLi) + (Number(currentX) - Number(touchstartX));
  //마우스 위치에 따라 즉시 카드 이동
  currentClassList.style.transition = "transform 0s linear";
  currentClassList.style.transform =
    "translateX(" + String(nowActiveLi) + "px)";
}

function processTouchStart(event) {
  mouseStart = true;
  // 해당 요소가 가진 고유동작 중단시키기(이미지만 드래그로 이동하는 동작 중단)
  event.preventDefault();
  touchstartX = event.clientX || event.touches[0].screenX;
  currentImg = event.target;

  // 드래그중(mousemove), 드래그 끝났을 때(mouseup)
  currentImg.addEventListener("mousemove", processTouchMove);
  currentImg.addEventListener("mouseup", processTouchEnd);

  // 모바일 터치 지원
  currentImg.addEventListener("touchmove", processTouchMove);
  currentImg.addEventListener("touchend", processTouchEnd);

  currentClassList = currentImg.parentElement.parentElement;
  currentActiveLi = currentClassList.getAttribute("data-position");
}

function processTouchEnd(event) {
  // 해당 요소가 가진 고유동작 중단시키기
  event.preventDefault();

  if (mouseStart) {
    currentImg.removeEventListener("mousemove", processTouchMove);
    currentImg.removeEventListener("mouseup", processTouchEnd);

    // 모바일 터치 지원
    currentImg.removeEventListener("touchmove", processTouchMove);
    currentImg.removeEventListener("touchend", processTouchEnd);

    // 맨 처음 카드가 맨 앞에 배치되도록 초기 상태로 이동
    currentClassList.style.transition = "transform 1s ease";
    currentClassList.style.transform = "translateX(0px)";
    currentClassList.setAttribute("data-position", 0);

    // 맨 처음 카드가 맨 앞에 배치된 상태로 화살표 버튼도 초기 상태로 변경
    let eachSlidePrev =
      currentClassList.previousElementSibling.children[1].children[0];
    let eachSlideNext =
      currentClassList.previousElementSibling.children[1].children[1];
    let eachLiList = currentClassList.getElementsByTagName("li");
    if (currentClassList.clientWidth < eachLiList.length * 260) {
      eachSlidePrev.style.color = "#2f3059";
      eachSlidePrev.classList.add("slide-prev-hover");
      eachSlidePrev.addEventListener("click", transformPrev);

      eachSlideNext.style.color = "#cfd8dc";
      eachSlideNext.classList.remove("slide-next-hover");
      eachSlideNext.removeEventListener("click", transformNext);
    }
    mouseStart = false;
  }
}

// 특정 요소를 드래그하다가, 요소 밖에서 드래그를 끝낼 수 있으므로 window에 이벤트 걸기
window.addEventListener("dragend", processTouchEnd);
window.addEventListener("mouseup", processTouchEnd);

// 인터페이스간의 오작동을 막기 위해, 카드 내의 이미지에만 드래그 인터페이스를 제공
const classImgLists = document.querySelectorAll("ul li img");
for (let i = 0; i < classImgLists.length; i++) {
  // 해당 요소에 마우스를 누르면 드래그를 시작할 수 있으므로 이벤트 걸기
  classImgLists[i].addEventListener("mousedown", processTouchStart);
  // 모바일 터치 지원
  classImgLists[i].addEventListener("touchstart", processTouchStart);
}
