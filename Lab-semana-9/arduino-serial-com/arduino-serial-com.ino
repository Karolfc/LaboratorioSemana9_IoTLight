/*
Peripherals:
 - Potentiometer
 - Push-button switch
 - Buzzer
*/


const int POTEN_PIN1 = A1;
const int POTEN_PIN2 = A0;
const int BTN_PIN = 2;

bool btnState = false;
bool previousState = false;

int potentiometerValue1 = 0;
int previousPotenValue1 = potentiometerValue1;
int threshold = 5;

int potentiometerValue2 = 0;
int previousPotenValue2 = potentiometerValue2;
int threshold = 5;



void setup() {
  pinMode(POTEN_PIN1, INPUT);
  pinMode(POTEN_PIN2, INPUT);
  pinMode(BTN_PIN, INPUT);
  Serial.begin(9600);
  
}

void loop() {
  sendingData();
  delay(10);

  Serial.print(potentiometerValue1);
  Serial.print(' ');
  Serial.print(potentiometerValue2);
  Serial.print(' ');
  Serial.print(btnState);
  Serial.print(' ');
  Serial.println();
  delay(400);
}

void sendingData() {

  potentiometerValue1 = analogRead(POTEN_PIN1);
  potentiometerValue2 = analogRead(POTEN_PIN2);
  btnState = digitalRead(BTN_PIN);

  //if (previousPotenValue1 != potentiometerValue1) {
  if (potentiometerValue1 > previousPotenValue1 + threshold || potentiometerValue1 < previousPotenValue1 - threshold) {
    sendSerialMessage('O', 'O', potentiometerValue1);
    previousPotenValue1 = potentiometerValue1;
  }

  //if (previousPotenValue2 != potentiometerValue2) {
  if (potentiometerValue2 > previousPotenValue2 + threshold || potentiometerValue2 < previousPotenValue2 - threshold) {
    sendSerialMessage('O', 'O', potentiometerValue2);
    previousPotenValue2 = potentiometerValue2;
  }

  if (btnState && !previousState) {  //Pressed!
    sendSerialMessage('W', '0', potentiometerValue1);
    sendSerialMessage('W', '0', potentiometerValue2);
    delay(50);
    previousState = true;
  } else if (!btnState && previousState) {  //Released!
    sendSerialMessage('O', 'O', potentiometerValue1);
    sendSerialMessage('O', 'O', potentiometerValue2);    
    previousState = false;
  }

  delay(100);
}


void sendSerialMessage(char keyA, char keyB, int potenValue) {
  Serial.print(keyA);
  Serial.print(' ');
  Serial.print(keyB);
  Serial.print(' ');
  Serial.print(potenValue);
  Serial.print(' ');
  Serial.println();
}