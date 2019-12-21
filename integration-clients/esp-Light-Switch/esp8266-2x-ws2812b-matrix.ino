/*
 * Author: Momme Jürgensen
 * Description: Integration-Client for Home Control
 * Repo: https://github.com/supermomme/home-control
 * Platform: ESP8266-01
 * Pins:
 * 
*/
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_NeoPixel.h>

const char* ssid = "TESTER";
const char* password = "TESTER";

WiFiServer server(80);
IPAddress ip(10,0,80,22);
IPAddress gateway(10,0,0,1);
IPAddress subnet(255,255,0,0);

IPAddress serverIp(10,0,0,12);
int serverPort = 33333;

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
}

void loop() {
}
