/*
 * Author: Momme Jürgensen
 * Description: Light-Switch Integration-Client for Home Control
 * Repo: https://github.com/supermomme/home-control
 * Platform: ESP8266-01
 * Pins:
 * 
 * DISCLAYMER: This is just a test and will be update for intended usage
*/
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_NeoPixel.h>

const char* ssid = "Test";
const char* password = "TeStTeSt";

WiFiServer server(80);
IPAddress ip(10,0,80,22);
IPAddress gateway(10,0,0,1);
IPAddress subnet(255,255,0,0);

const char* host = "10.0.0.12";
const uint16_t port = 33333;

String configString = "MODE=LIGHT_SWITCH";
int retryCountDown = 0;

WiFiClient client;

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
  Serial.printf("Connected to WiFi with IP %s\n", WiFi.localIP().toString().c_str());
}

bool light = false;
int countDown = 10000;

void loop() {

  // TODO: check switch instead of countdown
  // set output and send UPDATE
  countDown--;
  if (countDown <= 0) {
    countDown = 15000;
    light = !light;
    if (client.connected()) client.print("UPDATE:ENABLE="+(String)(light ? "1" : "0"));
    Serial.println(light);
  }

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
          int eqIndex = toInspect.indexOf("=");
          String key = toInspect.substring(0, eqIndex);
          String val = toInspect.substring(eqIndex+1, endOfVar);
          
          // handle key val (for light)
          if (key == "ENABLE") {
            // TODO: switch output instead of var
            light = (val == "1");
          }
          Serial.println(light);
          
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
  delay(1);
}
