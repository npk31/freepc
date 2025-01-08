function createCountDown_Tet(parent){
    const countdownTet = document.createElement("div");
    countdownTet.className = "countdown-tet";
    
    // Create style element
    const style = document.createElement("style");
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

        .countdown-tet{
            color: #fff;
        }
    
        :root{
            --pacifico:"Pacifico", cursive;
            --roboto:"Roboto", sans-serif;
        }
    
        .background{
            background: url("https://i.imgur.com/iBAIfQo.png") no-repeat;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            position: absolute;

            &:before{
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
                pointer-events: none; 
            }

        }
    
        .countdown-content{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -55%);
        }
        
        .tt-countdown{
            font-family: var(--pacifico);
            font-size: 32px;
            letter-spacing: 0.35px;
            text-align: center;
        }
    
        .digit{
            display: flex;
            height: 75px;
            background: rgba(40,50,61,.62);
            padding: 5px 10px;
            margin-top: 25px;
        }
    
        .digit > div {
            font-family: var(--roboto);
            text-align: center;
            margin: 0px 25px;
        }
    
        .number{
            font-size: 41px;
            margin: 0;
            font-weight: 500;
        }
    
        .label{
            font-size: 16px;
            margin-top: 3px;
            letter-spacing: 0.3px;
        }
    `;
    countdownTet.appendChild(style);
    
    // Create background
    const background = document.createElement("div");
    background.className = "background";
    countdownTet.appendChild(background);
    
    // Create countdown content
    const countdownContent = document.createElement("div");
    countdownContent.className = "countdown-content";
    
    // Create heading
    const heading = document.createElement("h1");
    heading.className = "tt-countdown";
    heading.textContent = "Tết Nguyên Đán";
    countdownContent.appendChild(heading);
    
    // Create digit container
    const digitContainer = document.createElement("div");
    digitContainer.className = "digit";
    countdownContent.appendChild(digitContainer);
    
    countdownTet.appendChild(countdownContent);
    parent.appendChild(countdownTet);
    
    // Function to create countdown elements
    function createCountdownElements() {
        const timeUnits = [["d", "Ngày"], ["h", "Giờ"], ["m", "Phút"], ["s", "Giây"]];
        
        timeUnits.forEach(unit => {
            const timeUnitDiv = document.createElement("div");
            
            const number = document.createElement("p");
            number.className = "number";
            number.id = unit[0].toLowerCase(); // ID: d, h, m, s
            number.textContent = "0"; // Default value
    
            const label = document.createElement("p");
            label.className = "label";
            label.textContent = unit[1];
    
            timeUnitDiv.appendChild(number);
            timeUnitDiv.appendChild(label);
            digitContainer.appendChild(timeUnitDiv);
        });
    }
    
    // Function to run countdown
    function RunningCountDown() {
        const checkElement = document.querySelector(".countdown-tet");
        if (!checkElement) return;
        
        const tetDate = new Date('2025-01-29T00:00:00');
        const currentTime = new Date();
        const timeDifference = tetDate - currentTime;
    
        if (timeDifference < 0) {
            clearInterval(interval);
            digitContainer.textContent = "Tết đã đến!";
            return;
        }
    
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
        document.getElementById("d").textContent = days.toString().padStart(2, "0"); 
        document.getElementById("h").textContent = hours.toString().padStart(2, "0"); 
        document.getElementById("m").textContent = minutes.toString().padStart(2, "0"); 
        document.getElementById("s").textContent = seconds.toString().padStart(2, "0"); 
    }
    
    // Create countdown elements
    createCountdownElements();
    
    // Set interval to run every second
    const interval = setInterval(RunningCountDown, 1000);
    RunningCountDown(); // Initial call to display countdown immediately
    
    function checkElementWidth() {
        const element = countdownTet;
        const tt = document.querySelector(".tt-countdown");
        const digit = document.querySelector(".digit");
    
        if (element.offsetWidth > 990) {
            tt.style.fontSize = "45px";
    
            digit.querySelectorAll("div").forEach((div) => {
                div.querySelector(".number").style.fontSize = "54px";
                div.querySelector(".label").style.fontSize = "21px";
            });
    
        } else if (element.offsetWidth < 635){
            tt.style.fontSize = "26px";
            digit.style.height = "65px";
    
            digit.querySelectorAll("div").forEach((div) => {
                div.querySelector(".number").style.fontSize = "32px";
                div.querySelector(".label").style.fontSize = "12px";

            });

        } else {
            tt.style = "";
            digit.style = "";
    
            digit.querySelectorAll("div").forEach((div) => {
                div.querySelector(".number").style = "";
                div.querySelector(".label").style = "";

            });
        }
    }
    
    checkElementWidth();
    window.addEventListener('resize', checkElementWidth);
}

