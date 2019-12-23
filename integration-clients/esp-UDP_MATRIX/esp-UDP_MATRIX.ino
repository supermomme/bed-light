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

IPAddress ip(10,0,80,23);
IPAddress gateway(10,0,0,1);
IPAddress subnet(255,255,0,0);

const char* host = "10.0.0.12";
const uint16_t port = 33334;
unsigned int localUdpPort = 33333;

char configString[] = "CONF:TYPE=UDP_MATRIX;NAME=Bed;WIDTH=2;HEIGHT=60;HOST=10.0.80.23;PORT=33333";
int retryCountDown = 0;

WiFiClient client;
WiFiUDP Udp;

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
  Serial.printf("Now in network at IP %s\n", WiFi.localIP().toString().c_str());
  

  strip0.begin();
  strip1.begin();
  strip0.setBrightness(255);
  strip1.setBrightness(255);
  
  Udp.begin(localUdpPort);
}

void loop() {
  if (client.connected()) {
    if (client.available() > 0) {
      if (payload == "REQ_CONF") {
        client.print(configString);
      } else if (payload == "PING") {
        client.print("PONG");
      }
    }

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
    }
    
  } else {
    retryCountDown--;
    if (retryCountDown <= 0) {
      Serial.println("Connect to server!");
      if (client.connect(host, port)) {
        Serial.println("Connected!");

        strip0.setPixelColor(3, 0, 255, 0);
        strip1.setPixelColor(3, 0, 255, 0);
        strip0.show();
        strip1.show();
        delay(500);
        strip0.clear();
        strip1.clear();
        strip0.show();
        strip1.show();

      } else {
        Serial.println("Connection failed! Retry in 10 seconds");
        retryCountDown = 10000;

        strip0.setPixelColor(3, 255, 0, 0);
        strip1.setPixelColor(3, 255, 0, 0);
        strip0.show();
        strip1.show();
      }
    }
  }
  delay(1);
}
