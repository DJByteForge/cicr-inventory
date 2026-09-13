/**
 * seed-inventory.ts
 * Seeds the complete CICR Robotics Lab Hardware Inventory (54 Items) into Supabase.
 *
 * Usage:
 *   npx ts-node src/scripts/seed-inventory.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

export interface SeedItem {
  name: string;
  category: 'Sensors' | 'Controllers' | 'Actuators' | 'Power' | 'Tools';
  quantity: number;
  available_quantity: number;
  location: string;
  description: string;
  tags: string[];
  image?: string | null;
}

export const INVENTORY_DATA: SeedItem[] = [
  // ── SENSORS (14 Items) ──
  {
    name: 'PIR Motion Sensor',
    category: 'Sensors',
    quantity: 3,
    available_quantity: 3,
    location: 'Sensors Bay - Rack S1, Box 1',
    description: 'HC-SR501 Passive Infrared (PIR) Motion Detector module with adjustable sensitivity and delay time (3.3V-5V DC).',
    tags: ['Sensors', 'Motion', 'PIR', 'HC-SR501', 'Infrared', 'Security'],
    image: 'drone.jpg'
  },
  {
    name: 'Moisture Sensor',
    category: 'Sensors',
    quantity: 3,
    available_quantity: 3,
    location: 'Sensors Bay - Rack S1, Box 2',
    description: 'Soil moisture and humidity detection sensor probe with LM393 comparator module for analog/digital reading.',
    tags: ['Sensors', 'Moisture', 'Soil', 'Analog', 'Agriculture', 'LM393'],
    image: 'drone.jpg'
  },
  {
    name: 'Temperature & Humidity Sensor',
    category: 'Sensors',
    quantity: 2,
    available_quantity: 2,
    location: 'Sensors Bay - Rack S1, Box 3',
    description: 'DHT11 / DHT22 Digital Temperature and Humidity Sensor with single-bus digital signal output.',
    tags: ['Sensors', 'Temperature', 'Humidity', 'DHT11', 'Weather', 'Digital'],
    image: 'drone.jpg'
  },
  {
    name: 'LDR Sensor',
    category: 'Sensors',
    quantity: 2,
    available_quantity: 2,
    location: 'Sensors Bay - Rack S1, Box 4',
    description: 'Light Dependent Resistor (Photoresistor) sensor module with onboard potentiometer for ambient light threshold detection.',
    tags: ['Sensors', 'LDR', 'Light', 'Photoresistor', 'Optoelectronics'],
    image: 'drone.jpg'
  },
  {
    name: 'Touch Sensor',
    category: 'Sensors',
    quantity: 1,
    available_quantity: 1,
    location: 'Sensors Bay - Rack S1, Box 5',
    description: 'TTP223 Capacitive Touch Switch Sensor Module with low power consumption and momentary/toggle modes.',
    tags: ['Sensors', 'Touch', 'Capacitive', 'TTP223', 'Switch', 'Digital'],
    image: 'drone.jpg'
  },
  {
    name: 'Gyroscope / Accelerometer',
    category: 'Sensors',
    quantity: 2,
    available_quantity: 2,
    location: 'Sensors Bay - Rack S2, Box 1',
    description: 'MPU-6050 6-Axis Motion Tracking Sensor (3-Axis Gyroscope + 3-Axis Accelerometer) with I2C interface.',
    tags: ['Sensors', 'Gyroscope', 'Accelerometer', 'IMU', 'MPU-6050', 'I2C', 'Navigation'],
    image: 'drone.jpg'
  },
  {
    name: 'Vibration Sensor',
    category: 'Sensors',
    quantity: 1,
    available_quantity: 1,
    location: 'Sensors Bay - Rack S2, Box 2',
    description: 'SW-420 Normally Closed Vibration Sensor Module with LM393 comparator for impact, shake, and tamper detection.',
    tags: ['Sensors', 'Vibration', 'SW-420', 'Impact', 'Shock', 'Digital'],
    image: 'drone.jpg'
  },
  {
    name: 'Light / Hall Effect Sensor',
    category: 'Sensors',
    quantity: 1,
    available_quantity: 1,
    location: 'Sensors Bay - Rack S2, Box 3',
    description: 'Combined Hall Effect Magnetic Field and Ambient Light detection module for positional tracking and proximity sensing.',
    tags: ['Sensors', 'Hall Effect', 'Magnetic', 'Light', 'Proximity'],
    image: 'drone.jpg'
  },
  {
    name: 'LM35CAZ Temperature Sensor',
    category: 'Sensors',
    quantity: 1,
    available_quantity: 1,
    location: 'Sensors Bay - Rack S2, Box 4',
    description: 'Precision Centigrade Temperature Sensor IC in TO-92 package with linear +10.0 mV/°C scale factor (-55°C to 150°C).',
    tags: ['Sensors', 'LM35', 'LM35CAZ', 'Temperature', 'Precision', 'Analog'],
    image: 'drone.jpg'
  },
  {
    name: 'Ultrasonic Sensor',
    category: 'Sensors',
    quantity: 3,
    available_quantity: 3,
    location: 'Sensors Bay - Rack S3, Box 1',
    description: 'HC-SR04 Ultrasonic Distance Measuring Transceiver Module (range 2cm - 400cm, 5V DC, trigger/echo).',
    tags: ['Sensors', 'Ultrasonic', 'HC-SR04', 'Distance', 'Range', 'Sonar'],
    image: 'drone.jpg'
  },
  {
    name: 'IR Sensor',
    category: 'Sensors',
    quantity: 5,
    available_quantity: 5,
    location: 'Sensors Bay - Rack S3, Box 2',
    description: 'Infrared Obstacle Avoidance Proximity Sensor with IR transmitter, receiver diode, and comparator circuit.',
    tags: ['Sensors', 'IR', 'Infrared', 'Obstacle Avoidance', 'Proximity'],
    image: 'drone.jpg'
  },
  {
    name: '5-Channel Infrared Tracking Sensor',
    category: 'Sensors',
    quantity: 1,
    available_quantity: 1,
    location: 'Sensors Bay - Rack S3, Box 3',
    description: '5-channel TCRT5000 IR Line Tracking Sensor array module for line-following autonomous robotics.',
    tags: ['Sensors', 'Line Tracking', 'TCRT5000', '5-Channel', 'Autonomous', 'Robotics'],
    image: 'drone.jpg'
  },
  {
    name: 'IR Receivers',
    category: 'Sensors',
    quantity: 3,
    available_quantity: 3,
    location: 'Sensors Bay - Rack S3, Box 4',
    description: 'TSOP38238 / VS1838B 38kHz Infrared Remote Control Receiver Sensor modules with integrated demodulator.',
    tags: ['Sensors', 'IR Receiver', '38kHz', 'TSOP', 'Demodulator', 'Remote'],
    image: 'drone.jpg'
  },
  {
    name: 'Neo-6M GPS Module',
    category: 'Sensors',
    quantity: 2,
    available_quantity: 2,
    location: 'Sensors Bay - Rack S3, Box 5',
    description: 'u-blox NEO-6M High Sensitivity Satellite GPS Positioning Module with ceramic patch antenna and EEPROM (UART).',
    tags: ['Sensors', 'GPS', 'NEO-6M', 'u-blox', 'Navigation', 'Satellite', 'UART'],
    image: 'drone.jpg'
  },

  // ── CONTROLLERS, DEV BOARDS AND PROGRAMMERS (6 Items) ──
  {
    name: 'Arduino Nano',
    category: 'Controllers',
    quantity: 4,
    available_quantity: 4,
    location: 'Controllers Bay - Rack C1, Tray 1',
    description: 'Compact ATmega328P 16MHz Microcontroller Board with 14 digital I/O, 8 analog inputs, and Mini-USB/Type-C interface.',
    tags: ['Controllers', 'Arduino', 'Nano', 'ATmega328P', 'MCU', 'Dev Board'],
    image: 'microchip.jpg'
  },
  {
    name: 'Arduino Uno R3',
    category: 'Controllers',
    quantity: 7,
    available_quantity: 7,
    location: 'Controllers Bay - Rack C1, Tray 2',
    description: 'Arduino Uno R3 ATmega328P Microcontroller Board with 14 digital I/O pins, 6 analog inputs, and 16MHz crystal oscillator.',
    tags: ['Controllers', 'Arduino', 'Uno', 'Uno R3', 'ATmega328P', 'MCU', 'Dev Board'],
    image: 'microchip.jpg'
  },
  {
    name: 'ESP32',
    category: 'Controllers',
    quantity: 6,
    available_quantity: 6,
    location: 'Controllers Bay - Rack C1, Tray 3',
    description: 'ESP-WROOM-32 32-bit Dual-Core 240MHz Wi-Fi + Bluetooth BLE Microcontroller Development Board.',
    tags: ['Controllers', 'ESP32', 'WiFi', 'Bluetooth', 'IoT', 'Dual-Core', 'MCU'],
    image: 'microchip.jpg'
  },
  {
    name: 'ESP32-CAM',
    category: 'Controllers',
    quantity: 4,
    available_quantity: 4,
    location: 'Controllers Bay - Rack C1, Tray 4',
    description: 'ESP32 Development Board integrated with OV2640 2MP Camera module and TF/microSD card slot for computer vision & IoT streaming.',
    tags: ['Controllers', 'ESP32-CAM', 'Camera', 'OV2640', 'Vision', 'AI', 'Video'],
    image: 'microchip.jpg'
  },
  {
    name: 'AVR / 8051 USB ISP Programmer',
    category: 'Controllers',
    quantity: 1,
    available_quantity: 1,
    location: 'Controllers Bay - Rack C2, Bin 1',
    description: 'USB-ASP In-System Programmer (ISP) with 10-pin IDC cable for flashing Atmel AVR (ATmega/ATtiny) and 8051 microcontrollers.',
    tags: ['Controllers', 'Programmer', 'USB-ASP', 'ISP', 'AVR', '8051', 'Flasher'],
    image: 'microchip.jpg'
  },
  {
    name: 'FT232RL FTDI USB-to-TTL Serial Adapter',
    category: 'Controllers',
    quantity: 1,
    available_quantity: 1,
    location: 'Controllers Bay - Rack C2, Bin 2',
    description: 'FT232RL FTDI USB 2.0 to UART TTL 6-Pin Serial Converter with 3.3V/5V selector jumper for MCU programming and debugging.',
    tags: ['Controllers', 'FTDI', 'FT232RL', 'USB-to-TTL', 'Serial', 'UART', 'Adapter'],
    image: 'microchip.jpg'
  },

  // ── MOTORS, SERVOS AND ACTUATORS (8 Items) ──
  {
    name: 'MG995 Servo',
    category: 'Actuators',
    quantity: 3,
    available_quantity: 3,
    location: 'Actuators Bay - Drawer M1, Section 1',
    description: 'High-Torque Metal Gear Standard Servo Motor (180 degree rotation, stall torque 10kg-cm to 13kg-cm at 6V).',
    tags: ['Actuators', 'Servo', 'MG995', 'Metal Gear', 'High Torque', '180-deg'],
    image: 'rover.jpg'
  },
  {
    name: 'MG90S Servo',
    category: 'Actuators',
    quantity: 8,
    available_quantity: 8,
    location: 'Actuators Bay - Drawer M1, Section 2',
    description: 'Micro Metal Gear Servo Motor (180 degree rotation, stall torque 2.2kg-cm at 6V, weight 13.4g) with mounting horns.',
    tags: ['Actuators', 'Servo', 'MG90S', 'Micro Servo', 'Metal Gear', 'Precision'],
    image: 'rover.jpg'
  },
  {
    name: 'SG90 Servo',
    category: 'Actuators',
    quantity: 3,
    available_quantity: 3,
    location: 'Actuators Bay - Drawer M1, Section 3',
    description: 'Ultra-lightweight 9g Micro Servo Motor with nylon gear train for aeromodelling, pan-tilt heads, and miniature robotics.',
    tags: ['Actuators', 'Servo', 'SG90', '9g', 'Micro Servo', 'Lightweight'],
    image: 'rover.jpg'
  },
  {
    name: 'Stepper Motor',
    category: 'Actuators',
    quantity: 8,
    available_quantity: 8,
    location: 'Actuators Bay - Drawer M2, Section 1',
    description: 'Bipolar 4-wire Stepper Motor (NEMA standard) for precise angular positioning and CNC / 3D printer axis propulsion.',
    tags: ['Actuators', 'Stepper Motor', 'NEMA', 'Bipolar', 'Precision', 'CNC'],
    image: 'rover.jpg'
  },
  {
    name: 'Pump Motor',
    category: 'Actuators',
    quantity: 1,
    available_quantity: 1,
    location: 'Actuators Bay - Drawer M2, Section 2',
    description: 'Miniature 3V-6V DC Submersible Fluid / Water Pump Motor for automated dispensing and fluid transfer robotics.',
    tags: ['Actuators', 'Pump Motor', 'Submersible', 'Water Pump', 'DC Motor', 'Fluidics'],
    image: 'rover.jpg'
  },
  {
    name: 'BLDC Motor — New',
    category: 'Actuators',
    quantity: 4,
    available_quantity: 4,
    location: 'Actuators Bay - Drawer M3, Section 1',
    description: 'Brand-new high-KV Brushless DC (BLDC) outrunner motor for quadcopter propulsion and high-speed robotic systems.',
    tags: ['Actuators', 'BLDC', 'Brushless', 'Drone', 'Multirotor', 'High RPM', 'New'],
    image: 'rover.jpg'
  },
  {
    name: 'BLDC Motor — Old',
    category: 'Actuators',
    quantity: 3,
    available_quantity: 3,
    location: 'Actuators Bay - Drawer M3, Section 2',
    description: 'Bench-tested Brushless DC (BLDC) outrunner motor for lab prototyping, aeromodelling tests, and test-rig experimentation.',
    tags: ['Actuators', 'BLDC', 'Brushless', 'Tested', 'Prototyping', 'Drone'],
    image: 'rover.jpg'
  },
  {
    name: 'DJI BLDC',
    category: 'Actuators',
    quantity: 1,
    available_quantity: 1,
    location: 'Actuators Bay - Drawer M3, Section 3',
    description: 'Original DJI tuned brushless motor for heavy-lift multirotor propulsion with precision bearings and balanced rotor.',
    tags: ['Actuators', 'DJI', 'BLDC', 'Brushless', 'Quadcopter', 'Propulsion', 'Aerospace'],
    image: 'rover.jpg'
  },

  // ── MOTOR DRIVERS AND ESCs (6 Items) ──
  {
    name: 'ESC',
    category: 'Actuators',
    quantity: 7,
    available_quantity: 7,
    location: 'Drivers & ESC Bay - Cabinet D1, Bin 1',
    description: 'Electronic Speed Controller (ESC) with integrated BEC for brushless DC motor drive and PWM throttle control.',
    tags: ['Actuators', 'ESC', 'Speed Controller', 'Brushless', 'PWM', 'Drone'],
    image: 'rover.jpg'
  },
  {
    name: 'Dual DC Motor Driver — TB6612FNG',
    category: 'Actuators',
    quantity: 1,
    available_quantity: 1,
    location: 'Drivers & ESC Bay - Cabinet D1, Bin 2',
    description: 'TB6612FNG Dual H-Bridge Motor Driver Carrier module (1.2A continuous / 3.2A peak per channel, high efficiency MOSFET output).',
    tags: ['Actuators', 'Motor Driver', 'TB6612FNG', 'Dual H-Bridge', 'MOSFET', 'DC Motor'],
    image: 'rover.jpg'
  },
  {
    name: 'L298D Motor Driver',
    category: 'Actuators',
    quantity: 1,
    available_quantity: 1,
    location: 'Drivers & ESC Bay - Cabinet D1, Bin 3',
    description: 'High-power dual full-bridge motor driver module with onboard 5V regulator and heat sink for high current DC/stepper loads.',
    tags: ['Actuators', 'Motor Driver', 'L298D', 'H-Bridge', 'Dual Channel', 'Power'],
    image: 'rover.jpg'
  },
  {
    name: 'L293N Motor Driver',
    category: 'Actuators',
    quantity: 3,
    available_quantity: 3,
    location: 'Drivers & ESC Bay - Cabinet D1, Bin 4',
    description: 'L293 / L293D dual full-bridge push-pull four-channel motor driver board with clamp diodes for inductive loads.',
    tags: ['Actuators', 'Motor Driver', 'L293N', 'L293D', 'H-Bridge', 'Robotics'],
    image: 'rover.jpg'
  },
  {
    name: 'BTS7960 Motor Driver',
    category: 'Actuators',
    quantity: 9,
    available_quantity: 9,
    location: 'Drivers & ESC Bay - Cabinet D1, Bin 5',
    description: 'BTS7960 43A High-Power Semiconductor Dual H-Bridge Motor Driver Module with thermal shutdown and current sensing.',
    tags: ['Actuators', 'Motor Driver', 'BTS7960', '43A', 'High Current', 'Combat Robotics', 'Heavy Duty'],
    image: 'rover.jpg'
  },
  {
    name: 'BL Helicopter 30A ESC',
    category: 'Actuators',
    quantity: 1,
    available_quantity: 1,
    location: 'Drivers & ESC Bay - Cabinet D1, Bin 6',
    description: '30A Brushless Helicopter Electronic Speed Controller (ESC) with 5V/2A BEC, soft-start governor, and multi-cell LiPo support.',
    tags: ['Actuators', 'ESC', '30A', 'Helicopter', 'Brushless', 'BEC', 'Aero'],
    image: 'rover.jpg'
  },

  // ── COMMUNICATION & REMOTE CONTROL (5 Items) ──
  {
    name: 'Radio Telemetry Kit — S-CU3E',
    category: 'Tools',
    quantity: 1,
    available_quantity: 1,
    location: 'Comms & RF Station - Cabinet R1, Shelf 1',
    description: 'S-CU3E Long-Range Radio Telemetry Transceiver Kit with paired ground and air modules (433MHz/915MHz) for MAVLink telemetry.',
    tags: ['Tools', 'Communication', 'Telemetry', 'Radio', 'S-CU3E', 'RF', 'MAVLink', 'Ground Station', 'Wireless'],
    image: 'microchip.jpg'
  },
  {
    name: 'CT6B Remote',
    category: 'Tools',
    quantity: 3,
    available_quantity: 3,
    location: 'Comms & RF Station - Cabinet R1, Shelf 2',
    description: 'FlySky FS-CT6B 2.4GHz 6-Channel Radio Transmitter and matched receiver set for RC aircraft and autonomous rovers.',
    tags: ['Tools', 'Communication', 'Remote Control', 'CT6B', 'FlySky', '6-Channel', 'Transmitter', '2.4GHz'],
    image: 'microchip.jpg'
  },
  {
    name: 'FlySky FS-i6 Remote',
    category: 'Tools',
    quantity: 1,
    available_quantity: 1,
    location: 'Comms & RF Station - Cabinet R1, Shelf 3',
    description: 'FlySky FS-i6 6-Channel 2.4GHz AFHDS 2A Digital Proportional Radio Control System with LCD telemetry display.',
    tags: ['Tools', 'Communication', 'Remote Control', 'FlySky', 'FS-i6', 'AFHDS 2A', 'Telemetry', 'Transmitter'],
    image: 'microchip.jpg'
  },
  {
    name: 'IR Wireless Remote — 21 Keys',
    category: 'Tools',
    quantity: 3,
    available_quantity: 3,
    location: 'Comms & RF Station - Cabinet R2, Bin 1',
    description: '21-Key Infrared Wireless Remote Control transmitter keypad with standard NEC protocol and CR2025/CR2032 coin cell.',
    tags: ['Tools', 'Communication', 'IR Remote', '21 Keys', 'Infrared', 'NEC Protocol', 'Wireless'],
    image: 'microchip.jpg'
  },
  {
    name: 'Joystick',
    category: 'Tools',
    quantity: 2,
    available_quantity: 2,
    location: 'Comms & RF Station - Cabinet R2, Bin 2',
    description: 'Dual-Axis Analog PS2 Thumb Joystick Module (X/Y potentiometers + integrated tactile pushbutton).',
    tags: ['Tools', 'Communication', 'Joystick', 'Analog', 'PS2', 'Dual Axis', 'Input', 'Controller'],
    image: 'microchip.jpg'
  },

  // ── DISPLAYS & OUTPUT DEVICES (4 Items) ──
  {
    name: 'OLED Display',
    category: 'Tools',
    quantity: 1,
    available_quantity: 1,
    location: 'Display & Output Unit - Drawer O1, Tray 1',
    description: '0.96-inch Monochrome 128x64 I2C OLED Display Module (SSD1306 driver, 3.3V/5V compatible, high contrast).',
    tags: ['Tools', 'Displays', 'Display', 'OLED', 'SSD1306', 'I2C', '128x64', 'Visual'],
    image: 'microchip.jpg'
  },
  {
    name: 'TFT Display — 2.4 inch',
    category: 'Tools',
    quantity: 1,
    available_quantity: 1,
    location: 'Display & Output Unit - Drawer O1, Tray 2',
    description: '2.4-inch Full Color 240x320 SPI TFT LCD Display Module with integrated resistive touch panel and SD card slot.',
    tags: ['Tools', 'Displays', 'Display', 'TFT', '2.4 inch', 'SPI', 'Color LCD', 'Graphics'],
    image: 'microchip.jpg'
  },
  {
    name: '8×8 LED Matrix',
    category: 'Tools',
    quantity: 1,
    available_quantity: 1,
    location: 'Display & Output Unit - Drawer O1, Tray 3',
    description: '8x8 Red LED Dot Matrix Display Module with MAX7219 serial driver IC for text, shapes, and animations.',
    tags: ['Tools', 'Displays', 'Display', 'LED Matrix', '8x8', 'MAX7219', 'Matrix', 'Digital'],
    image: 'microchip.jpg'
  },
  {
    name: 'Buzzer Module',
    category: 'Tools',
    quantity: 3,
    available_quantity: 3,
    location: 'Display & Output Unit - Drawer O1, Tray 4',
    description: 'Piezoelectric Active/Passive Audible Buzzer Module with transistor driver for alarm beeps and frequency tones.',
    tags: ['Tools', 'Displays', 'Buzzer', 'Audio', 'Sound', 'Alarm', 'Piezo', 'Output'],
    image: 'microchip.jpg'
  },

  // ── POWER SUPPLY & POWER ELECTRONICS (5 Items) ──
  {
    name: 'Battery Chargers',
    category: 'Power',
    quantity: 3,
    available_quantity: 3,
    location: 'Power Station - Cabinet P1, Shelf 1',
    description: 'Smart Microprocessor Balance Charger and Discharger for LiPo, Li-Ion, NiMH, and Lead-Acid robotics batteries.',
    tags: ['Power', 'Charger', 'Balance Charger', 'LiPo', 'Battery Charger', 'Smart Charger'],
    image: 'rover.jpg'
  },
  {
    name: 'Batteries',
    category: 'Power',
    quantity: 11,
    available_quantity: 11,
    location: 'Power Station - Cabinet P1, Fireproof Safe',
    description: 'High-Discharge Lithium-Polymer (LiPo) / 18650 Li-Ion rechargeable battery packs for combat robots and aerial drones.',
    tags: ['Power', 'Batteries', 'LiPo', 'Li-Ion', 'Rechargeable', 'High Discharge', 'Energy'],
    image: 'rover.jpg'
  },
  {
    name: 'Buck Converter',
    category: 'Power',
    quantity: 3,
    available_quantity: 3,
    location: 'Power Station - Cabinet P2, Bin 1',
    description: 'LM2596 / MP1584 Step-Down DC-DC Buck Converter Module with adjustable output voltage (4V-35V in, 1.23V-30V out).',
    tags: ['Power', 'Buck Converter', 'DC-DC', 'Step-Down', 'LM2596', 'Regulator'],
    image: 'rover.jpg'
  },
  {
    name: 'Relay Module',
    category: 'Power',
    quantity: 5,
    available_quantity: 5,
    location: 'Power Station - Cabinet P2, Bin 2',
    description: '5V Optocoupler-Isolated Single/Multi-Channel Relay Module for switching AC 250V/10A or DC 30V/10A high-power circuits.',
    tags: ['Power', 'Relay', 'Optocoupler', 'Switch', 'High Voltage', 'Isolation'],
    image: 'rover.jpg'
  },
  {
    name: 'Potentiometer',
    category: 'Power',
    quantity: 2,
    available_quantity: 2,
    location: 'Power Station - Cabinet P2, Bin 3',
    description: 'Standard 10k Rotary Precision Potentiometer with knurled shaft for voltage dividing, tuning, and sensor calibration.',
    tags: ['Power', 'Potentiometer', 'Variable Resistor', '10k', 'Tuning', 'Analog'],
    image: 'rover.jpg'
  },

  // ── MECHANICAL & MISCELLANEOUS COMPONENTS (6 Items) ──
  {
    name: 'Ignition Wires',
    category: 'Tools',
    quantity: 1,
    available_quantity: 1,
    location: 'Mechanical Bay - Bin M1, Section 1',
    description: 'Heavy-duty high-temperature silicone insulated ignition and spark-gap wiring set for internal combustion and pyrotechnics.',
    tags: ['Tools', 'Mechanical', 'Ignition', 'Wiring', 'High Voltage', 'Silicone'],
    image: 'rover.jpg'
  },
  {
    name: 'Resistor Box',
    category: 'Tools',
    quantity: 2,
    available_quantity: 2,
    location: 'Mechanical Bay - Bin M1, Section 2',
    description: 'Comprehensive 1/4W Metal Film Resistor Assortment Kit Box containing common values from 10 ohm to 1M ohm.',
    tags: ['Tools', 'Mechanical', 'Resistor Box', 'Passives', 'Components', 'Assorted', 'Electronics Kit'],
    image: 'rover.jpg'
  },
  {
    name: 'Arduino Cables',
    category: 'Tools',
    quantity: 12,
    available_quantity: 12,
    location: 'Mechanical Bay - Bin M2, Rack 1',
    description: 'USB Type-A to Type-B / Mini-USB programming cables and heavy-duty jumper wire sets for Arduino boards.',
    tags: ['Tools', 'Mechanical', 'Cables', 'Arduino', 'USB', 'Programming', 'Jumper Wires'],
    image: 'rover.jpg'
  },
  {
    name: 'ESP Cables',
    category: 'Tools',
    quantity: 10,
    available_quantity: 10,
    location: 'Mechanical Bay - Bin M2, Rack 2',
    description: 'High-speed shielded Micro-USB and USB-C data synchronization cables for ESP32/ESP8266 development boards.',
    tags: ['Tools', 'Mechanical', 'Cables', 'ESP32', 'Micro-USB', 'Type-C', 'Data Sync', 'Shielded'],
    image: 'rover.jpg'
  },
  {
    name: 'I²C Serial Interface Module',
    category: 'Tools',
    quantity: 1,
    available_quantity: 1,
    location: 'Mechanical Bay - Bin M3, Tray 1',
    description: 'PCF8574 I2C Serial Backpack Interface Module for driving 1602 / 2004 character LCD displays using only 2 MCU pins.',
    tags: ['Tools', 'Mechanical', 'I2C', 'PCF8574', 'Interface', 'Adapter', 'Serial', 'LCD Backpack'],
    image: 'rover.jpg'
  },
  {
    name: 'RUN CAM',
    category: 'Tools',
    quantity: 1,
    available_quantity: 1,
    location: 'Mechanical Bay - Bin M3, Tray 2',
    description: 'RunCam Micro / Swift High-Resolution Ultra-Low Latency FPV Camera (1/3" Sony CCD sensor, WDR, OSD) for drone piloting.',
    tags: ['Tools', 'Mechanical', 'Camera', 'RunCam', 'FPV', 'Video', 'Low Latency', 'Drone'],
    image: 'rover.jpg'
  }
];

export async function seedInventory() {
  console.log(`\n📦 CICR Robotics Lab — Inventory Seeding Script`);
  console.log(`   Target Supabase: ${supabaseUrl}`);
  console.log(`   Total items to seed: ${INVENTORY_DATA.length}`);
  console.log('─'.repeat(60));

  // Check existing items
  const { data: existing, error: fetchErr } = await supabase
    .from('inventory')
    .select('id, name');

  if (fetchErr) {
    console.error('❌ Error fetching existing items:', fetchErr.message);
    process.exit(1);
  }

  const existingMap = new Map<string, string>();
  if (existing) {
    existing.forEach((item: any) => existingMap.set(item.name.toLowerCase().trim(), item.id));
  }

  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of INVENTORY_DATA) {
    const existingId = existingMap.get(item.name.toLowerCase().trim());
    const now = new Date().toISOString();

    if (existingId) {
      // Update existing item
      const { error: updateErr } = await supabase
        .from('inventory')
        .update({
          category: item.category,
          quantity: item.quantity,
          available_quantity: item.available_quantity,
          location: item.location,
          description: item.description,
          tags: item.tags,
          image: item.image,
          updated_at: now
        })
        .eq('id', existingId);

      if (updateErr) {
        console.error(`   ⚠️  Failed to update "${item.name}":`, updateErr.message);
      } else {
        console.log(`   🔄 Updated: ${item.name} (${item.quantity} units) [${item.category}]`);
        updatedCount++;
      }
    } else {
      // Insert new item
      const { error: insertErr } = await supabase
        .from('inventory')
        .insert([
          {
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            available_quantity: item.available_quantity,
            location: item.location,
            description: item.description,
            tags: item.tags,
            image: item.image,
            created_at: now,
            updated_at: now
          }
        ]);

      if (insertErr) {
        console.error(`   ❌ Failed to insert "${item.name}":`, insertErr.message);
      } else {
        console.log(`   ✅ Inserted: ${item.name} (${item.quantity} units) [${item.category}]`);
        insertedCount++;
      }
    }
  }

  console.log('─'.repeat(60));
  console.log(`🎉 Seeding Complete!`);
  console.log(`   New Items Added: ${insertedCount}`);
  console.log(`   Existing Items Updated: ${updatedCount}`);
  console.log(`   Total Catalog Items: ${INVENTORY_DATA.length}\n`);
}

if (require.main === module) {
  seedInventory()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal seeding error:', err);
      process.exit(1);
    });
}
