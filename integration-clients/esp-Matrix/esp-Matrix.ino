/*
 * Author: Momme Jürgensen
 * Description: WS2812B-Matrix Integration-Client for Home Control
 * Repo: https://github.com/supermomme/home-control
 * Platform: NODEMCU ESP8266
 * Pins:
 * D1 strip 1
 * D2 strip 2
*/

#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_NeoPixel.h>

const char* ssid = "Test";
const char* password = "TeStTeSt";

WiFiServer server(80);
IPAddress ip(10,0,80,23);
IPAddress gateway(10,0,0,1);
IPAddress subnet(255,255,0,0);

const char* host = "10.0.0.12";
const uint16_t port = 33333;

String configString = "TYPE=MATRIX;NAME=Bed;WIDTH=2;HEIGHT=60";
int retryCountDown = 0;

WiFiClient client;

Adafruit_NeoPixel strip0(60, D1, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel strip1(60, D2, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(115200);
  Serial.println();

  Serial.printf("Connecting to %s ", ssid);
  WiFi.config(ip, gateway, subnet);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected");

  server.begin();
  Serial.printf("Now listening at IP %s\n", WiFi.localIP().toString().c_str());

  strip0.begin();
  strip1.begin();
  strip0.setBrightness(255);
  strip1.setBrightness(255);
}

void loop() {
  bool updateStrip0 = false;
  bool updateStrip1 = false;
  if (client.connected()) {
    if (client.available() > 0) {
      String payload = client.readStringUntil('\n');
      if (payload == "REQ_CONF") {
        client.print("CONF:"+configString);
      } else if (payload == "PING") {
        client.print("PONG");
      } else if (payload.startsWith("UPDATE")) {
        int pointIndex = payload.indexOf(":");
        if (pointIndex == -1) return;
        String newState = payload.substring(pointIndex+1);
        while (newState.length() > 0) {
          int endOfVar = newState.indexOf(";");
          String toInspect = newState.substring(0, endOfVar);
          if (endOfVar == -1) newState = "";
          else newState = newState.substring(endOfVar+1);
          
          // extract key val out of toInspect
          // TODO: if has # use other method
          int X = -1;
          int Y = -1;
          float R = -1;
          float G = -1;
          float B = -1;
          
          while (toInspect.length()) {
            
            int endOfSection = toInspect.indexOf("#");
            String SectiontoInspect = toInspect.substring(0, endOfSection);
            if (endOfSection == -1) toInspect = "";
            else toInspect = toInspect.substring(endOfSection+1);
            
            int eqIndex = SectiontoInspect.indexOf("=");
            String key = SectiontoInspect.substring(0, eqIndex);
            String val = SectiontoInspect.substring(eqIndex+1, endOfSection);
            if (key == "X") X = val.toInt();
            else if (key == "Y") Y = val.toInt();
            else if (key == "R") R = val.toFloat();
            else if (key == "G") G = val.toFloat();
            else if (key == "B") B = val.toFloat();
            
            if(X != -1 && Y != -1 && R != -1 && G != -1 && B != -1) {
              
              /*
              Serial.print("X: ");
              Serial.print(X);
              Serial.print(" Y: ");
              Serial.print(Y);
              Serial.print(" R: ");
              Serial.print(R);
              Serial.print(" G: ");
              Serial.print(G);
              Serial.print(" B: ");
              Serial.print(B);
              Serial.println();
              */
  
              if (X == 0) {
                strip0.setPixelColor(Y, R, G, B);
                updateStrip0 = true;
                
              } else if (X == 1) {
                strip1.setPixelColor(Y, R, G, B);
                updateStrip1 = true;
              }
            }
          }
        }
      }
    }
  } else {
    retryCountDown--;
    if (retryCountDown <= 0) {
      Serial.println("Connect to server!");
      if (client.connect(host, port)) {
        Serial.println("Connected!");
      } else {
        Serial.println("Connection failed! Retry in 10 seconds");
        retryCountDown = 10000;
      }
    }
  }
  if (updateStrip0) strip0.show();
  if (updateStrip1) strip1.show();
  delay(1);
}
