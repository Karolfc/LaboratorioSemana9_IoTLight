const NGROK = `${window.location.hostname}`;
let socket = io(NGROK, { path: '/real-time' });
console.log('Server IP: ', NGROK);

/WEBSOCKET COMMUNICATION ______________/

const LED1 = document.getElementById('CheckLED1');
LED1.addEventListener('change', Lights);

const LED2 = document.getElementById('CheckLED2');
LED2.addEventListener('change', Lights);

function Lights(){

    const checkbox = this;
    let msn = '';

    if (checkbox.id === 'CheckLED1') {
    if (checkbox.checked) {
        msn = 'A1'
        console.log(msn);
        socket.emit('orderForArduino', msn);
        } else {
            msn = 'A0'
            console.log(msn);
            socket.emit('orderForArduino', msn);
        }
    }
    else if (checkbox.id === 'CheckLED2') {
    if (checkbox.checked) {
        msn = 'B1'
        console.log(msn);
        socket.emit('orderForArduino', msn);
        } else {
            msn = 'B0'
            console.log(msn);
            socket.emit('orderForArduino', msn);
        }
    }
};

socket.on('arduinoMessage', (arduinoMessage) => { //Recibe mensaje arduino
    console.log(arduinoMessage);
    let { actionA, actionB, signal } = arduinoMessage;
    updateLightLevel(actionA, signal);
    updateLEDstatus(actionA, actionB, signal);
})

function updateLightLevel(actionA, signal) {
    
    let levelMessage;

    if(actionA == 'P'){

        if (signal <= 499) {
            levelMessage = `  <div id="Light_Level_Text">
                                  <div class="Light_Bar_Grey">
                                      <div class="Bar" id="Low_Bar"></div>
                                  </div>
                                  <h2>Low Light 💡</h2> <br><br>
                                  <p>Consider turning on both lights</p><br>
                              </div>
                          `;
          } else if (signal >= 500 && signal <= 800) {
            levelMessage = `   
                              <div id="Light_Level_Text">
                                  <div class="Light_Bar_Grey">
                                      <div class="Bar" id="Medium_Bar""></div>
                                  </div>
                                  <h2>Medium Light 💡</h2> <br><br>
                                  <p>Consider turning on one light</p><br>
                              </div>
                          `;
          } else {
            levelMessage = `   
                              <div id="Light_Level_Text">
                                  <div class="Light_Bar_Grey">
                                      <div class="Bar" id="High_Bar""></div>
                                  </div>
                                  <h2>High Light 💡</h2> <br><br>
                                  <p>Consider turning off both lights</p><br>
                              </div>
                          `;
          }
          document.getElementById("Light_Level").innerHTML = levelMessage;      
    }

    };

    function updateLEDstatus(actionA, actionB, signal){

        var Bombillo1 = document.getElementById("Bombillo1");
        var Bombillo2 = document.getElementById("Bombillo2");

        var Light1 = document.getElementById("Light1");
        var Light2 = document.getElementById("Light2");

        var Label1 = document.getElementById("Label1");
        var Label2 = document.getElementById("Label2");

        var Status1 = document.getElementById("Status1");
        var Status2 = document.getElementById("Status2");
        
        if (actionA == 'L'){

            if(actionB == 'A'){

                switch (signal) {
                    case 0:
                        console.log('LED 1 Off');
                        Status1.innerHTML = 'Light is Off';
                                    
                        Bombillo1.src = "./images/LightOff.png";
                        Light1.style.backgroundColor = "#2E2E2E";
                        Label1.style.color = "#ffffff";
                        Status1.style.color = "#ffffff";

                        break;
                
                    case 1:
                        console.log('LED 1 On');
                        Status1.innerHTML = 'Light is On';

                        Bombillo1.src = "./images/LightOn.png";
                        Light1.style.backgroundColor = "#F2FCFF";
                        Label1.style.color = "#444444";
                        Status1.style.color = "#444444";

                        break;
                }
            }

            if(actionB == 'B'){

                switch (signal) {
                    case 0:
                        console.log('LED 2 Off');
                        Status2.innerHTML = 'Light is off';

                        Bombillo2.src = "./images/LightOff.png";
                        Light2.style.backgroundColor = "#2E2E2E";
                        Label2.style.color = "#ffffff";
                        Status2.style.color = "#ffffff";

                        break;
                
                    case 1:
                        console.log('LED 2 On');
                        Status2.innerHTML = 'Light is on';

                        Bombillo2.src = "./images/LightOn.png";
                        Light2.style.backgroundColor = "#F2FCFF";
                        Label2.style.color = "#444444";
                        Status2.style.color = "#444444";

                        break;
                }
            }
        }
    }