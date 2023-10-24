const canvas = document.getElementById("GameCanvas");
const output_div = document.getElementById("OutputDiv");
const context = canvas.getContext("2d");

var ram = null;
var display_data = null;
var stack = null;
var keyboard = null;
var timers = null;

var size = 10;

var on_color = "white";
var off_color = "black";

var can_clock = true;

//cpu_registers holds the registers of the cpu PC, SP, and I in this order
var cpu_registers = null;
var general_registers = null;

var font = new Uint8Array([
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80  // F
]);

function ToHex(num, prefix = true) {
    return (prefix == true ? "0x" : "") + (num.toString(16)).toUpperCase();
}
function LogInstruction(opcode, byte1, byte2) {
    var current_element = null;
    if (output_div.childElementCount < 25) {
        var new_h1 = document.createElement("h1");
        output_div.appendChild(new_h1);
        current_element = new_h1;
    }

    for (var i = 0; i < output_div.childElementCount - 1; i++) {
        output_div.childNodes[i].innerText = output_div.childNodes[i + 1].innerText;
    }

    current_element = output_div.childNodes[output_div.childElementCount - 1];
    output_div.scrollTop = output_div.scrollHeight;

    //Getting instruction
    var instruction = `XXX ${ToHex(opcode)}`;
    switch ((byte1 & 0xF0) >> 4) {
        case 0x0:
            switch (byte2) {
                case 0xE0:
                    instruction = "CLS";
                    break;
                case 0xE0:
                    instruction = "RET";
                    break;
                default:
                    break;
            }
            break;
        case 0x1:
            instruction = "JMP " + ToHex(opcode & 0xFFF);
            break;
        case 0x2:
            instruction = "JSR " + ToHex(opcode & 0xFFF);
            break;
        case 0x3:
            instruction = `SKEQ V${ToHex(byte1 & 0xF, false)}, ${ToHex(byte2)}`
            break;
        case 0x4:
            instruction = `SKNE V${ToHex(byte1 & 0xF, false)}, ${ToHex(byte2)}`
            break;
        case 0x5:
            instruction = `SKEQ V${ToHex(byte1 & 0xF, false)}, V${ToHex(byte2, false)}`
            break;
        case 0x6:
            instruction = `MOV V${ToHex(byte1 & 0xF, false)}, ${ToHex(byte2)}`
            break;
        case 0x7:
            instruction = `ADD V${ToHex(byte1 & 0xF, false)}, ${ToHex(byte2)}`
            break;
        case 0x8:
            switch (byte2 & 0xF) {
                case 0x0:
                    instruction = `LD V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 >> 4) & 0xF, false)}`
                    break;
                case 0x1:
                    instruction = `OR V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 >> 4) & 0xF, false)}`
                    break;

                case 0x2:
                    instruction = `AND V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 >> 4) & 0xF, false)}`
                    break;

                case 0x3:
                    instruction = `XOR V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 >> 4) & 0xF, false)}`
                    break;
                case 0x4:
                    instruction = `ADD V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 >> 4) & 0xF, false)}`
                    break;
                case 0x5:
                    instruction = `SUB V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 >> 4) & 0xF, false)}`
                    break;
                case 0x6:
                    instruction = `SHR V${ToHex(byte1 & 0xF, false)} {, V${ToHex((byte2 >> 4) & 0xF, false)}}`
                    break;
                case 0x7:
                    instruction = `SUBN V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 >> 4) & 0xF, false)}`
                    break;
                case 0xE:
                    instruction = `SHL V${ToHex(byte1 & 0xF, false)} {, V${ToHex((byte2 >> 4) & 0xF, false)}}`
                    break;
                default:
                    break;
            }
            break;
        case 0x9:
            instruction = `SNE V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 >> 4) & 0xF, false)}`
            break;
        case 0xA:
            instruction = `LD I, ${ToHex(opcode & 0xFFF)}`
            break;
        case 0xB:
            instruction = `JMP V0, ${ToHex(opcode & 0xFFF)}`
            break;
        case 0xC:
            instruction = `RND V0, V${ToHex(byte1 & 0xF, false)} ${ToHex(byte2)}`
            break;
        case 0xD:
            instruction = `SPRITE V${ToHex(byte1 & 0xF, false)}, V${ToHex((byte2 & 0xF0) >> 4, false)} ${ToHex(byte2 & 0xF)}`
            break;
        case 0xE:
            switch (byte2) {
                case 0x9E:
                    instruction = "SKP V" + ToHex(byte1 & 0xF, false);
                    break;
                case 0xA1:
                    instruction = "SKNP V" + ToHex(byte1 & 0xF, false);
                    break;
                default:
                    break;
            }
            break;
        case 0xF:
            switch (byte2) {
                case 0x07:
                    instruction = `LD V${ToHex(byte1 & 0xF, false)}, DT`;
                    break;
                case 0x0A:
                    instruction = `LD V${ToHex(byte1 & 0xF, false)}, K`;
                    break;
                case 0x15:
                    instruction = `LD DT, V${ToHex(byte1 & 0xF, false)}`;
                    break;
                case 0x18:
                    instruction = `LD ST, V${ToHex(byte1 & 0xF, false)}`;
                    break;
                case 0x1E:
                    instruction = `ADD I, V${ToHex(byte1 & 0xF, false)}`;
                    break;
                case 0x29:
                    instruction = `LD F, V${ToHex(byte1 & 0xF, false)}`;
                    break;
                case 0x33:
                    instruction = `LD B, V${ToHex(byte1 & 0xF, false)}`;
                    break;
                case 0x55:
                    instruction = `LD [I], V${ToHex(byte1 & 0xF, false)}`;
                    break;
                case 0x65:
                    instruction = `LD V${ToHex(byte1 & 0xF, false)}, [I]`;
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    //Outputting it
    current_element.innerText = `0x${cpu_registers[0].toString(16)} : ${instruction}`;
}
function Start() {
    Init();

    document.addEventListener('keydown', (e) => {
        if (e.repeat)
            return;

        OnKeyEvent(e.key, 1);
    });

    document.addEventListener('keyup', (e) => {
        if (e.repeat)
            return;

        OnKeyEvent(e.key, 0);
    });

    fetch('/Client/Emulators/Chip8/Roms/pong.rom').then(res => res.arrayBuffer()).then(arrayBuffer => {
        // use ArrayBuffer
        const view = new Uint8Array(arrayBuffer);
        for (var i = 0; i < arrayBuffer.byteLength; i++)
            SetMemVal(i + 0x200, view[i]);

        can_clock = true;
        setInterval(Update, 1000 / 60);
    });
}

function Init() {
    ram = new Uint8Array(1024 * 4);
    display_data = new Uint8ClampedArray(64 * 32);
    cpu_registers = new Uint16Array(3);
    general_registers = new Uint8Array(16);
    keyboard = new Uint8Array(16);
    stack = new Uint16Array(256);
    timers = new Uint8Array(2); // Delay Timer, Sound Timer

    ram.fill(0, 0, display_data.length);
    display_data.fill(0, 0, display_data.length);
    cpu_registers.fill(0, 0, cpu_registers.length);
    general_registers.fill(0, 0, general_registers.length);

    cpu_registers[0] = 0x200;

    //Loading Font
    for (var i = 0; i < font.length; i++) {
        SetMemVal(0x00 + i, font[i]);
    }

    canvas.width = 64 * size;
    canvas.height = 32 * size;
}

function OnKeyEvent(key, press) {
    switch (key) {
        case '1':
            keyboard[0] = press;
            break;
        case '2':
            keyboard[1] = press;
            break;
        case '3':
            keyboard[2] = press;
            break;
        case '4':
            keyboard[3] = press;
            break;
        case 'q':
            keyboard[4] = press;
            break;
        case 'w':
            keyboard[5] = press;
            break;
        case 'e':
            keyboard[6] = press;
            break;
        case 'r':
            keyboard[7] = press;
            break;
        case 'a':
            keyboard[8] = press;
            break;
        case 's':
            keyboard[9] = press;
            break;
        case 'd':
            keyboard[10] = press;
            break;
        case 'f':
            keyboard[11] = press;
            break;
        case 'z':
            keyboard[12] = press;
            break;
        case 'x':
            keyboard[13] = press;
            break;
        case 'c':
            keyboard[14] = press;
            break;
        case 'v':
            keyboard[15] = press;
            break;
    }
}

function Update() {
    Clock();
    Draw();
}

function Clock() {
    if (can_clock == false)
        return;

    var byte1 = GetMemVal(cpu_registers[0]);
    var byte2 = GetMemVal(cpu_registers[0] + 1);
    var opcode = (byte1 << 8) | byte2;
    LogInstruction(opcode, byte1, byte2);

    switch ((byte1 & 0xF0) >> 4) {
        case 0x0: {
            switch (byte2 & 0xFF) {
                case 0xE0:
                    //Clear Screen
                    display_data.fill(0, 0, display_data.length);
                    cpu_registers[0] += 2;
                    break;
                case 0xEE:
                    //Return from subroutine
                    cpu_registers[1]--;
                    cpu_registers[0] = stack[cpu_registers[1]] + 2;
                    break;
                default:
                    cpu_registers[0] = opcode & 0xFFF;
                    break;
            }
            break;
        }
        case 0x1: {
            cpu_registers[0] = (opcode & 0x0FFF);
            break;
        }
        case 0x2: {
            stack[cpu_registers[1]] = cpu_registers[0];
            cpu_registers[1]++;
            cpu_registers[0] = (opcode & 0x0FFF);
            break;
        }
        case 0x3: {
            general_registers[byte1 & 0xF] == byte2 ? cpu_registers[0] += 4 : cpu_registers[0] += 2;
            break;
        }
        case 0x4: {
            general_registers[byte1 & 0xF] != byte2 ? cpu_registers[0] += 4 : cpu_registers[0] += 2;
            break;
        }
        case 0x5: {
            general_registers[byte1 & 0xF] == general_registers[(byte2 >> 4) & 0xF] ? cpu_registers[0] += 4 : cpu_registers[0] += 2;
            break;
        }
        case 0x6: {
            general_registers[byte1 & 0xF] = byte2;
            cpu_registers[0] += 2;
            break;
        }
        case 0x7: {
            general_registers[byte1 & 0x0F] += byte2;
            cpu_registers[0] += 2;
            break;
        }
        case 0x8: {
            //console.log(ToHex(byte2));
            switch (byte2 & 0x0F) {
                case 0x0:
                    general_registers[(byte1 & 0xF)] = general_registers[(byte2 & 0xF0) >> 4];
                    cpu_registers[0] += 2;
                    break;
                case 0x1:
                    general_registers[(byte1 & 0xF)] |= general_registers[(byte2 & 0xF0) >> 4];
                    cpu_registers[0] += 2;
                    break;
                case 0x2:
                    general_registers[(byte1 & 0xF)] &= general_registers[(byte2 & 0xF0) >> 4];
                    cpu_registers[0] += 2;
                    break;
                case 0x3:
                    general_registers[(byte1 & 0xF)] ^= general_registers[(byte2 & 0xF0) >> 4];
                    cpu_registers[0] += 2;
                    break;
                case 0x4:
                    var vy = general_registers[(byte2 & 0xF0) >> 4];
                    //general_registers[0xF] = general_registers[(byte1 & 0xF)] + vy >> 8;
                    general_registers[(byte1 & 0xF)] += vy;
                    general_registers[0xF] = (general_registers[(byte1 & 0xF)] < vy ? 1 : 0);
                    cpu_registers[0] += 2;
                    break;
                case 0x5:
                    var vy = general_registers[(byte2 & 0xF0) >> 4];
                    general_registers[0xF] = general_registers[(byte1 & 0xF)] > vy ? 1 : 0;
                    general_registers[(byte1 & 0xF)] -= vy;
                    cpu_registers[0] += 2;
                    break;
                case 0x6:
                    general_registers[0xF] = general_registers[(byte1 & 0xF)] & 1;
                    general_registers[(byte1 & 0xF)] = general_registers[(byte2 & 0xF0) >> 4];
                    general_registers[(byte1 & 0xF)] >>= 1;
                    cpu_registers[0] += 2;
                    break;
                case 0x7:
                    var vy = general_registers[(byte2 & 0xF0) >> 4];
                    general_registers[0xF] = (general_registers[(byte1 & 0xF)] > vy ? 1 : 0);
                    general_registers[(byte1 & 0xF)] = vy - general_registers[(byte1 & 0xF)];
                    cpu_registers[0] += 2;
                    break;
                case 0xE:
                    general_registers[(byte1 & 0xF)] = general_registers[(byte2 & 0xF0) >> 4];
                    general_registers[0xF] = (general_registers[(byte1 & 0xF)] >> 8) & 1;
                    general_registers[(byte1 & 0xF)] <<= 1;
                    cpu_registers[0] += 2;
                    break;
                default:
                    console.log(`Unknown opcode: ${opcode.toString(16)}`);
                    break;
            }
            break;
        }
        case 0x9: {
            general_registers[byte1 & 0xF] != general_registers[(byte2 & 0xF0) >> 4] ? cpu_registers[0] += 4 : cpu_registers[0] += 2;
            break;
        }
        case 0xA: {
            cpu_registers[2] = opcode & 0xFFF;
            cpu_registers[0] += 2;
            break;
        }
        case 0xC: {
            general_registers[(byte1 & 0xF)] = Math.floor(Math.random() * 255) & byte2;
            cpu_registers[0] += 2;
            break;
        }
        case 0xD: {
            var height = byte2 & 0xF;
            var x = general_registers[byte1 & 0x0F] % 64;
            var y = general_registers[(byte2 & 0x0F0) >> 4] % 32;

            general_registers[15] = 0;

            for (var c = 0; c < height; c++) {
                var pixel = GetMemVal(cpu_registers[2] + c);

                for (var r = 0; r < 8; r++) {
                    var global_x = x + r;
                    var global_y = y + c;

                    if ((global_x >= 0 && global_x < 64 && global_y >= 0 && global_y < 32) && (pixel & (0x80 >> r)) != 0) {
                        if (display_data[(global_y * 64) + global_x] == 1)
                            general_registers[15] = 1;

                        display_data[(global_y * 64) + global_x] ^= 1;
                    }
                }
                //console.log(data_i);
            }

            //console.log("Drawing: " + x + " " + y);
            cpu_registers[0] += 2;
            break;
        }
        case 0xE: {
            switch (byte2) {
                case 0x9E: {
                    keyboard[general_registers[byte1 & 0xF]] > 0 ? cpu_registers[0] += 4 : cpu_registers[0] += 2;
                    break;
                }
                case 0xA1: {
                    keyboard[general_registers[byte1 & 0xF]] == 0 ? cpu_registers[0] += 4 : cpu_registers[0] += 2;
                    break
                }
                default: {
                    console.log(`Unknown opcode: ${opcode.toString(16)}`);
                    break;
                }
            }
            break;
        }
        case 0xF:
            switch (byte2) {
                case 0x07:
                    general_registers[byte1 & 0xF] = timers[0];
                    cpu_registers[0] += 2;
                    break;
                case 0x15:
                    timers[0] = general_registers[byte1 & 0xF];
                    cpu_registers[0] += 2;
                    break;
                case 0x18:
                    timers[1] = general_registers[byte1 & 0xF];
                    cpu_registers[0] += 2;
                    break;
                case 0x29:
                    cpu_registers[2] = general_registers[byte1 & 0xF] * 0x5;
                    cpu_registers[0] += 2;
                    break;
                case 0x33:
                    var val = general_registers[byte1 & 0xF];
                    SetMemVal(cpu_registers[2] + 0, Math.floor(val / 100));
                    SetMemVal(cpu_registers[2] + 1, Math.floor((val / 10) % 10));
                    SetMemVal(cpu_registers[2] + 2, Math.floor(val % 10));
                    cpu_registers[0] += 2;
                    break;
                case 0x55:
                    var val = byte1 & 0xF;
                    for (var i = 0; i <= val; i++)
                        SetMemVal(cpu_registers[2] + i, general_registers[i]);

                    cpu_registers[0] += 2;
                    break;
                case 0x65:
                    var val = byte1 & 0xF;
                    for (var i = 0; i <= val; i++)
                        general_registers[i] = GetMemVal(cpu_registers[2] + i);

                    cpu_registers[0] += 2;
                    break;
                default:
                    console.log(`Unknown opcode: ${opcode.toString(16)}`);
                    break;
            }
            break;
        default: {
            console.log(`Unknown opcode: ${opcode.toString(16)}`);
            break;
        }
    }

    timers[0]--;
    timers[1]--;
}

function Draw() {
    /*
    Potential Optimization
    Only redraw if screen data is modified
    */
    for (var x = 0; x < 64; x++) {
        for (var y = 0; y < 32; y++) {
            context.fillStyle = (display_data[(y * 64) + x] > 0) ? on_color : off_color;
            context.fillRect(x * size, (y * size), size, size);
        }
    }
}

function GetMemVal(location) {
    if (location < 0 || location >= ram.length)
        return 0;
    return ram[location];
}

function SetMemVal(location, val) {
    if (location >= 0 && location < ram.length)
        ram[location] = val;
}

Start();