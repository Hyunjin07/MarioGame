let move_speed = 3,
  gravity = 0.5;
let mario = document.querySelector(".mario");
let img = document.getElementById("mario-1");
let sound_point = new Audio("sounds effect/point.mp3");
let sound_die = new Audio("sounds effect/die.mp3");
let backgroundSound = new Audio("sounds effect/super mario.mp3");

let mario_props = mario.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");
let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

let coinInterval;
let speedIconInterval;

// 시작전 셋팅
document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && game_state != "Play") {
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block";
    mario.style.top = "40vh";
    game_state = "Play";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    backgroundSound.play();
    play();
  }
});

function play() {
  function move() {
    if (game_state != "Play") return;

    let pipe_sprite = document.querySelectorAll(".pipe_sprite"); // 밑에 코드에 pipe_sprite생성
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      mario_props = mario.getBoundingClientRect();
      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          mario_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          mario_props.left + mario_props.width > pipe_sprite_props.left &&
          mario_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          mario_props.top + mario_props.height > pipe_sprite_props.top
        ) {
          game_state = "End";
          message.innerHTML =
            "Game Over".fontcolor("red") + "<br>Press Enter To Restart";
          message.classList.add("messageStyle");
          img.style.display = "none";
          sound_die.play();
          stopCreation(); // 종료 시 생성 중지
          return;
        } else {
          if (
            pipe_sprite_props.right < mario_props.left &&
            pipe_sprite_props.right + move_speed >= mario_props.left &&
            element.increase_score == "1"
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_sprite_props.left - move_speed + "px";
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  //마리오 움직임
  let mario_dy = 0;
  function apply_gravity() {
    if (game_state != "Play") return;
    mario_dy = mario_dy + gravity; //게임 시작시 마리오 애개 중력 적용 아래로 떨어짐
    document.addEventListener("keydown", (e) => {
      //keydown 사용자가 위에 화살표 눌렸을때 점프
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/mario2.png";
        mario_dy = -7.6; //점프의 시작점에서 마리오의 수직 속도는 음수 값(예: -7.6)으로 설정되어 마리오가 위로 올라가게된다
      }
    });

    document.addEventListener("keyup", (e) => {
      // keyup 사용자가 위에 화살표를 손에서 키를 떼었을때 마리오 원래 이미지
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/mario.png";
      }
    });

    if (mario_props.top <= 0 || mario_props.bottom >= background.bottom) {
      game_state = "End";
      message.style.left = "28vw";
      window.location.reload();
      message.classList.remove("messageStyle");
      stopCreation(); // 종료 시 생성 중지
      return; // 마리오 죽음
    }
    mario.style.top = mario_props.top + mario_dy + "px";
    mario_props = mario.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  /*-----------------------------------------------------------------------------------------------*/
  let pipe_seperation = 0;
  let pipe_gap = 35;

  function create_pipe() {
    if (game_state != "Play") return;

    if (pipe_seperation > 115) {
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
      pipe_sprite_inv.style.left = "100vw";

      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";

      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
  /*-----------------------------------------------------------------------------------------------*/

  // 코인 생성 함수
  function create_coin() {
    if (game_state != "Play") return; // 게임이 종료된 경우 생성하지 않음

    let coin = document.createElement("div");
    coin.className = "coin";

    let coin_posi = Math.floor(Math.random() * 43) + 8; // 코인 위치 랜덤 설정
    let coin_left = Math.floor(Math.random() * 70) + 15; // 코인을 랜덤한 가로 위치에서 생성

    coin.style.top = coin_posi + "vh";
    coin.style.left = coin_left + "vw";

    // mario 요소 앞에 코인을 추가합니다.
    document.body.insertBefore(coin, mario.nextElementSibling);

    // 코인이 생성된 후 8초 뒤에 숨깁니다.
    setTimeout(function () {
      coin.style.display = "none"; // 코인 숨기기
    }, 8000);
  }

  // 코인 생성 시작
  coinInterval = setInterval(create_coin, 3000);

  // 코인과의 충돌 감지 함수
  function check_coin_collision() {
    let coin_list = document.querySelectorAll(".coin");
    coin_list.forEach((coin) => {
      let coin_props = coin.getBoundingClientRect();
      if (
        mario_props.left < coin_props.left + coin_props.width &&
        mario_props.left + mario_props.width > coin_props.left &&
        mario_props.top < coin_props.top + coin_props.height &&
        mario_props.top + mario_props.height > coin_props.top
      ) {
        coin.remove(); // 코인과 충돌 시 코인 제거
        score_val.innerHTML = +score_val.innerHTML + 2; // 점수 2점 증가
        sound_point.play();
      }
    });
  }

  //매 프레임마다 코인과의 충돌 감지 수행
  function animate() {
    if (game_state === "Play") {
      check_coin_collision();
    }
    requestAnimationFrame(animate);
  }

  // 게임 시작 후 충돌 감지 함수 호출
  animate();

  /*-----------------------------------------------------------------------------------------------*/
  // 스피드 아이콘 생성 함수
  function createSpeedIcon() {
    if (game_state != "Play") return; // 게임이 종료된 경우 생성하지 않음

    let speedIcon = document.createElement("div");
    speedIcon.className = "speed-icon";
    let iconTop = Math.floor(Math.random() * 80) + 10; // 랜덤한 세로 위치
    let iconLeft = Math.floor(Math.random() * 70) + 15; // 랜덤한 가로 위치
    speedIcon.style.top = iconTop + "vh";
    speedIcon.style.left = iconLeft + "vw";

    // mario 요소 앞에 스피드 아이콘을 추가합니다.
    document.body.insertBefore(speedIcon, mario.nextElementSibling);
    setTimeout(function () {
      speedIcon.style.display = "none"; // 스피드 아이콘 숨기기
    }, 4000);
  }

  // 게임 시작 후 스피드 아이콘 생성
  speedIconInterval = setInterval(createSpeedIcon, 6000);

  //스피드 아이콘 위치 무작위 생성
  function handleSpeedIconCollision() {
    let speedIcons = document.querySelectorAll(".speed-icon");
    speedIcons.forEach((icon) => {
      let iconProps = icon.getBoundingClientRect();
      if (
        mario_props.left < iconProps.left + iconProps.width &&
        mario_props.left + mario_props.width > iconProps.left &&
        mario_props.top < iconProps.top + iconProps.height &&
        mario_props.top + mario_props.height > iconProps.top
      ) {
        icon.remove(); // 스피드 아이콘 제거
        // 장애물을 무시하고 새의 스피드를 증가시킴
        move_speed *= 1.5;
        gravity *= 2;
        setTimeout(() => {
          // 일정 시간이 지난 후 스피드 아이콘 효과 해제
          move_speed /= 2;
          gravity /= 2;
        }, 5000);
      }
    });
  }

  // 매 프레임마다 스피드 아이콘과의 충돌 감지 수행
  function animateSpeedIcon() {
    if (game_state === "Play") {
      handleSpeedIconCollision();
    }
    requestAnimationFrame(animateSpeedIcon);
  }

  // 게임 시작 후 스피드 아이콘 충돌 감지 함수 호출
  animateSpeedIcon();
}
/*-----------------------------------------------------------------------------------------------*/
function stopCreation() {
  clearInterval(coinInterval);
  clearInterval(speedIconInterval);
}

// function endGame() {
//   // 다른 게임 종료 로직
//   stopCreation();
// }++++

// function gameOver() {
//   // 다른 게임 오버 로직
//   endGame();
// }
