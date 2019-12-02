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

WiFiUDP Udp;
IPAddress ip(10,0,80,21);   
IPAddress gateway(10,0,0,1);   
IPAddress subnet(255,255,0,0);   
unsigned int localUdpPort = 33333;

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

  Udp.begin(localUdpPort);
  Serial.printf("Now listening at IP %s, UDP port %d\n", WiFi.localIP().toString().c_str(), localUdpPort);

  strip0.begin();
  strip1.begin();
  strip0.setBrightness(255);
  strip1.setBrightness(255);
}

void loop() {
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    byte packet[packetSize];
    Udp.readBytes(packet, packetSize);
    if (packetSize/5.0 == packetSize/5) {
      //Serial.println("Got good Package");
      bool updateStrip0 = false;
      bool updateStrip1 = false;
      for (int i=1; i<=packetSize/5; i++) {
        /*
        Serial.print(i);
        Serial.print(" Strip: ");
        Serial.print(packet[i*5-5], HEX);
        Serial.print(" Addr: ");
        Serial.print(packet[i*5-4], HEX);
        Serial.print(" R: ");
        Serial.print(packet[i*5-3], HEX);
        Serial.print(" G: ");
        Serial.print(packet[i*5-2], HEX);
        Serial.print(" B: ");
        Serial.print(packet[i*5-1], HEX);
        Serial.println();
        */
        if (packet[i*5-5] == 0x00) {
          strip0.setPixelColor(packet[i*5-4], packet[i*5-3], packet[i*5-2], packet[i*5-1]);
          updateStrip0 = true;
          
        } else if (packet[i*5-5] == 0x01) {
          strip1.setPixelColor(packet[i*5-4], packet[i*5-3], packet[i*5-2], packet[i*5-1]);
          updateStrip1 = true;
        }
      }
      if (updateStrip0) strip0.show();
      if (updateStrip1) strip1.show();
    } else {
      Serial.println("Got bad Package!");
    }
    Udp.endPacket();
  }
}
