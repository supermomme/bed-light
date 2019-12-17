/*
 * Author: Momme Jürgensen
 * Description: UDP Server that controls two WS2912B. This is a part of my UDP System
 * Repo: https://github.com/supermomme/bed-light
 * Platform: NODEMCU ESP8266
 * Pins:
 * D1 strip 1
 * D2 strip 2
 * 
 * Disclaymer: This sketch is not perfect and will be refactored in the future
*/
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_NeoPixel.h>

const char* ssid = "TESTER";
const char* password = "TESTER";

WiFiServer server(80);
IPAddress ip(10,0,80,21);
IPAddress gateway(10,0,0,1);
IPAddress subnet(255,255,0,0);

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
  WiFiClient client = server.available();
  if (client) {
    while (client.connected()) {
      while (client.available()>0) {        
        int packetSize = client.available();
        byte packet[packetSize];
        client.readBytes(packet, packetSize);
        // Serial.println(packet[0]);
        if (packet[0] == 0x01) { // ask for config
          client.print("CONFIG:m=Matrix;w=2;h=60"); // answer config
        } else if (packet[0] == 0x02){
          client.print("Smiley :)");
          // mode specific handling (my mode is "Matrix"
          bool updateStrip0 = false;
          bool updateStrip1 = false;

          int offset = 1; // Because of the command byte
          for (int i=1; i<=(packetSize-offset)/5; i++) {
            int p = (i*5) + offset;
            /*
            Serial.print(" X: ");
            Serial.print(packet[p-5], HEX);
            Serial.print(" Y: ");
            Serial.print(packet[p-4], HEX);
            Serial.print(" R: ");
            Serial.print(packet[p-3], HEX);
            Serial.print(" G: ");
            Serial.print(packet[p-2], HEX);
            Serial.print(" B: ");
            Serial.print(packet[p-1], HEX);
            Serial.println();
            */
                        
            if (packet[p-5] == 0x00) {
              strip0.setPixelColor(packet[p-4], packet[p-3], packet[p-2], packet[p-1]);
              updateStrip0 = true;
              
            } else if (packet[p-5] == 0x01) {
              strip1.setPixelColor(packet[p-4], packet[p-3], packet[p-2], packet[p-1]);
              updateStrip1 = true;
            }
          }
          if (updateStrip0) strip0.show();
          if (updateStrip1) strip1.show();
      
        }
      }
      delay(10);
    }
    client.stop();
    Serial.println("Client disconnected");
  }
}
