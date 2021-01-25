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
function transformPrev(event) {
  const slidePrev = event.target;
  const slideNext = slidePrev.nextElementSibling;

  //ul 태그 선택
  const classList = slidePrev.parentElement.parentElement.nextElementSibling;
  let activeLi = classList.getAttribute("data-position");
  const liList = classList.getElementsByTagName("li");

  if (classList.clientWidth < liList.length * 260 + Number(activeLi)) {
    // 위치를 왼쪽으로 260이동
    activeLi = Number(activeLi) - 260;

    if (classList.clientWidth > liList.length * 260 + Number(activeLi)) {
      slidePrev.style.color = "#cfd8dc";
      slidePrev.classList.remove("slide-prev-hover");
    }

    slideNext.style.color = "#2f3059";
    slideNext.classList.add("slide-next-hover");
  }
  classList.style.transition = "transform 1s";
  classList.style.transform = "translateX(" + String(activeLi) + "px)";
  classList.setAttribute("data-postition", activeLi);
}

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
    arrowContainer.removeChild(slidePrevList[i]);
    arrowContainer.removeChild(slidePrevList[i].nextElementSibling);
  }
}
