//BASED OFF OF Sharp LR35902

const flags = {
    Z: 1 << 7,
    S: 1 << 6,
    H: 1 << 5,
    C: 1 << 4,
}

function ToHex(num, prefix = true, digits = null) {
    var hex = (num.toString(16)).toUpperCase();
    
    while(digits != null && hex.length < digits)
        hex = "0" + hex;

    return (prefix == true ? "0x" : "") + hex;
}

class Cpu {
    Reset() {
        this.main_registers = new Uint16Array(2); // PC, SP
        this.registers = new Uint8Array(8);
        this.ram = new Uint8Array(1024 * 64);
        //Order is A, B, C, D, E, F, H, L
        //Groups are AF, BC, DE, HL
        
        this.main_registers.fill(0, 0, this.main_registers.length);
        this.registers.fill(0, 0, this.registers.length);
        this.ram.fill(0, 0, this.ram.length);

        this.can_emulate = true;

        this.opcodes = [
            ()=>{this.Op00()},
            ()=>{this.Op01()},
            ()=>{this.Op02()},
            ()=>{this.Op03()},
            ()=>{this.Op04()},
            ()=>{this.Op05()},
            ()=>{this.Op06()},
            ()=>{this.Op07()},
            ()=>{this.Op08()},
            ()=>{this.Op09()},
            ()=>{this.Op0A()},
            ()=>{this.Op0B()},
            ()=>{this.Op0C()},
            ()=>{this.Op0D()},
            ()=>{this.Op0E()},
            ()=>{this.Op0F()},

            ()=>{this.Op10()},
            ()=>{this.Op11()},
            ()=>{this.Op12()},
            ()=>{this.Op13()},
            ()=>{this.Op14()},
            ()=>{this.Op15()},
            ()=>{this.Op16()},
            ()=>{this.Op17()},
            ()=>{this.Op18()},
            ()=>{this.Op19()},
            ()=>{this.Op1A()},
            ()=>{this.Op1B()},
            ()=>{this.Op1C()},
            ()=>{this.Op1D()},
            ()=>{this.Op1E()},
            ()=>{this.Op1F()},

            ()=>{this.Op20()},
            ()=>{this.Op21()},
            ()=>{this.Op22()},
            ()=>{this.Op23()},
            ()=>{this.Op24()},
            ()=>{this.Op25()},
            ()=>{this.Op26()},
            ()=>{this.Op27()},
            ()=>{this.Op28()},
            ()=>{this.Op29()},
            ()=>{this.Op2A()},
            ()=>{this.Op2B()},
            ()=>{this.Op2C()},
            ()=>{this.Op2D()},
            ()=>{this.Op2E()},
            ()=>{this.Op2F()},

            ()=>{this.Op30()},
            ()=>{this.Op31()},
            ()=>{this.Op32()},
            ()=>{this.Op33()},
            ()=>{this.Op34()},
            ()=>{this.Op35()},
            ()=>{this.Op36()},
            ()=>{this.Op37()},
            ()=>{this.Op38()},
            ()=>{this.Op39()},
            ()=>{this.Op3A()},
            ()=>{this.Op3B()},
            ()=>{this.Op3C()},
            ()=>{this.Op3D()},
            ()=>{this.Op3E()},
            ()=>{this.Op3F()},

            ()=>{this.Op40()},
            ()=>{this.Op41()},
            ()=>{this.Op42()},
            ()=>{this.Op43()},
            ()=>{this.Op44()},
            ()=>{this.Op45()},
            ()=>{this.Op46()},
            ()=>{this.Op47()},
            ()=>{this.Op48()},
            ()=>{this.Op49()},
            ()=>{this.Op4A()},
            ()=>{this.Op4B()},
            ()=>{this.Op4C()},
            ()=>{this.Op4D()},
            ()=>{this.Op4E()},
            ()=>{this.Op4F()},

            ()=>{this.Op50()},
            ()=>{this.Op51()},
            ()=>{this.Op52()},
            ()=>{this.Op53()},
            ()=>{this.Op54()},
            ()=>{this.Op55()},
            ()=>{this.Op56()},
            ()=>{this.Op57()},
            ()=>{this.Op58()},
            ()=>{this.Op59()},
            ()=>{this.Op5A()},
            ()=>{this.Op5B()},
            ()=>{this.Op5C()},
            ()=>{this.Op5D()},
            ()=>{this.Op5E()},
            ()=>{this.Op5F()},

            ()=>{this.Op60()},
            ()=>{this.Op61()},
            ()=>{this.Op62()},
            ()=>{this.Op63()},
            ()=>{this.Op64()},
            ()=>{this.Op65()},
            ()=>{this.Op66()},
            ()=>{this.Op67()},
            ()=>{this.Op68()},
            ()=>{this.Op69()},
            ()=>{this.Op6A()},
            ()=>{this.Op6B()},
            ()=>{this.Op6C()},
            ()=>{this.Op6D()},
            ()=>{this.Op6E()},
            ()=>{this.Op6F()},

            ()=>{this.Op70()},
            ()=>{this.Op71()},
            ()=>{this.Op72()},
            ()=>{this.Op73()},
            ()=>{this.Op74()},
            ()=>{this.Op75()},
            ()=>{this.Op76()},
            ()=>{this.Op77()},
            ()=>{this.Op78()},
            ()=>{this.Op79()},
            ()=>{this.Op7A()},
            ()=>{this.Op7B()},
            ()=>{this.Op7C()},
            ()=>{this.Op7D()},
            ()=>{this.Op7E()},
            ()=>{this.Op7F()},

            ()=>{this.Op80()},
            ()=>{this.Op81()},
            ()=>{this.Op82()},
            ()=>{this.Op83()},
            ()=>{this.Op84()},
            ()=>{this.Op85()},
            ()=>{this.Op86()},
            ()=>{this.Op87()},
            ()=>{this.Op88()},
            ()=>{this.Op89()},
            ()=>{this.Op8A()},
            ()=>{this.Op8B()},
            ()=>{this.Op8C()},
            ()=>{this.Op8D()},
            ()=>{this.Op8E()},
            ()=>{this.Op8F()},

            ()=>{this.Op90()},
            ()=>{this.Op91()},
            ()=>{this.Op92()},
            ()=>{this.Op93()},
            ()=>{this.Op94()},
            ()=>{this.Op95()},
            ()=>{this.Op96()},
            ()=>{this.Op97()},
            ()=>{this.Op98()},
            ()=>{this.Op99()},
            ()=>{this.Op9A()},
            ()=>{this.Op9B()},
            ()=>{this.Op9C()},
            ()=>{this.Op9D()},
            ()=>{this.Op9E()},
            ()=>{this.Op9F()},

            ()=>{this.OpA0()},
            ()=>{this.OpA1()},
            ()=>{this.OpA2()},
            ()=>{this.OpA3()},
            ()=>{this.OpA4()},
            ()=>{this.OpA5()},
            ()=>{this.OpA6()},
            ()=>{this.OpA7()},
            ()=>{this.OpA8()},
            ()=>{this.OpA9()},
            ()=>{this.OpAA()},
            ()=>{this.OpAB()},
            ()=>{this.OpAC()},
            ()=>{this.OpAD()},
            ()=>{this.OpAE()},
            ()=>{this.OpAF()},

            ()=>{this.OpB0()},
            ()=>{this.OpB1()},
            ()=>{this.OpB2()},
            ()=>{this.OpB3()},
            ()=>{this.OpB4()},
            ()=>{this.OpB5()},
            ()=>{this.OpB6()},
            ()=>{this.OpB7()},
            ()=>{this.OpB8()},
            ()=>{this.OpB9()},
            ()=>{this.OpBA()},
            ()=>{this.OpBB()},
            ()=>{this.OpBC()},
            ()=>{this.OpBD()},
            ()=>{this.OpBE()},
            ()=>{this.OpBF()},

            ()=>{this.OpC0()},
            ()=>{this.OpC1()},
            ()=>{this.OpC2()},
            ()=>{this.OpC3()},
            ()=>{this.OpC4()},
            ()=>{this.OpC5()},
            ()=>{this.OpC6()},
            ()=>{this.OpC7()},
            ()=>{this.OpC8()},
            ()=>{this.OpC9()},
            ()=>{this.OpCA()},
            ()=>{this.OpCB()},
            ()=>{this.OpCC()},
            ()=>{this.OpCD()},
            ()=>{this.OpCE()},
            ()=>{this.OpCF()},

            ()=>{this.OpD0()},
            ()=>{this.OpD1()},
            ()=>{this.OpD2()},
            ()=>{this.XXX()},
            ()=>{this.OpD4()},
            ()=>{this.OpD5()},
            ()=>{this.OpD6()},
            ()=>{this.OpD7()},
            ()=>{this.OpD8()},
            ()=>{this.OpD9()},
            ()=>{this.OpDA()},
            ()=>{this.XXX()},
            ()=>{this.OpDC()},
            ()=>{this.XXX()},
            ()=>{this.OpDE()},
            ()=>{this.OpDF()},

            ()=>{this.OpE0()},
            ()=>{this.OpE1()},
            ()=>{this.OpE2()},
            ()=>{this.XXX()},
            ()=>{this.OpE4()},
            ()=>{this.OpE5()},
            ()=>{this.OpE6()},
            ()=>{this.OpE7()},
            ()=>{this.OpE8()},
            ()=>{this.OpE9()},
            ()=>{this.OpEA()},
            ()=>{this.XXX()},
            ()=>{this.OpEC()},
            ()=>{this.XXX()},
            ()=>{this.OpEE()},
            ()=>{this.OpEF()},

            ()=>{this.OpF0()},
            ()=>{this.OpF1()},
            ()=>{this.OpF2()},
            ()=>{this.OpF3()},
            ()=>{this.XXX()},
            ()=>{this.OpF5()},
            ()=>{this.OpF6()},
            ()=>{this.OpF7()},
            ()=>{this.OpF8()},
            ()=>{this.OpF9()},
            ()=>{this.OpFA()},
            ()=>{this.OpFB()},
            ()=>{this.XXX()},
            ()=>{this.XXX()},
            ()=>{this.OpFE()},
            ()=>{this.OpFF()},
        ];
    }

    //Modify Registers
    GetA() {
        return this.registers[0];
    }
    GetB() {
        return this.registers[1];
    }
    GetC() {
        return this.registers[2];
    }
    GetD() {
        return this.registers[3];
    }
    GetE() {
        return this.registers[4];
    }
    GetF() {
        return this.registers[5];
    }
    GetH() {
        return this.registers[6];
    }
    GetL() {
        return this.registers[7];
    }
    //Setting Registers
    SetA(val) {
        this.registers[0] = val;
    }
    SetB(val) {
        this.registers[1] = val;
    }
    SetC(val) {
        this.registers[2] = val;
    }
    SetD(val) {
        this.registers[3] = val;
    }
    SetE(val) {
        this.registers[4] = val;
    }
    SetF(val) {
        this.registers[5] = val;
    }
    SetH(val) {
        this.registers[6] = val;
    }
    SetL(val) {
        this.registers[7] = val;
    }
    //Getting Combined Registers
    GetAF(){
        return (this.registers[0] << 8) | this.registers[5];
    }
    GetBC(){
        return (this.registers[1] << 8) | this.registers[2];
    }
    GetDE(){
        return (this.registers[3] << 8) | this.registers[4];
    }
    GetHL(){
        return (this.registers[6] << 8) | this.registers[7];
    }
    //Setting Combined Registers
    SetAF(val){
        this.registers[0] = val >> 8;
        this.registers[5] = val & 0xFF;
    }
    SetBC(val){
        this.registers[1] = val >> 8;
        this.registers[2] = val & 0xFF;
    }
    SetBC(val){
        this.registers[3] = val >> 8;
        this.registers[4] = val & 0xFF;
    }
    SetHL(val){
        this.registers[6] = val >> 8;
        this.registers[7] = val & 0xFF;
    }

    SetFlag(flag, set){
        if(set){
            this.SetF(this.GetF() | flag);
        }
        else{
            //If we are clearing we invert the flag and & with other parts
            this.SetF(this.GetF() & ~flag);
        }
    }
    
    GetMemVal(location){
        if(location >= 0 && location < this.ram.length)
            return this.ram[location];
        return 0;
    }
    SetMemVal(location, val){
        if(location >= 0 && location < this.ram.length)
            this.ram[location] = val;
    }

    GetPC(){
        return this.main_registers[0];
    }
    GetSP(){
        return this.main_registers[1];
    }
    SetPC(val){
        this.main_registers[0] = val;
    }
    SetSP(val){
        this.main_registers[1] = val;
    }
    AddPC(val){
        this.main_registers[0] += val;
    }

    GetOpcode(){
        return this.GetMemVal(this.GetPC());
    }
    Clock(){
        if(this.can_emulate == false)
            return;
        
        var opcode = this.GetOpcode();
        console.log(`Opcode PC:${ToHex(this.GetPC(), true, 4)} ${ToHex(this.GetOpcode(), true, 2)}`);
        var codes = this.opcodes;;//[()=>{this.Op00()}];
        var func = codes[opcode];

        if(typeof func != "function"){
            console.log(`Illegal Opcode ${ToHex(this.GetPC(), true, 4)} ${ToHex(opcode, true, 2)}`);
            this.can_emulate = false;
            return;
        }else{
            try{
                func();
            }catch(exception){
                console.log(`Illegal Opcode ${ToHex(this.GetPC(), true, 4)} ${ToHex(opcode, true, 2)}`);
                this.can_emulate = false;
                return;
            }
        }
    }
    
    //Instructions
    XXX(){
        console.log(`Illegal Opcode PC:${ToHex(this.GetPC(), true, 4)} ${ToHex(this.GetOpcode(), true, 2)}`);
    }
    //8 Bit Instructions
    Op00(){
        this.AddPC(1);
    }
    //Incrementing
    Op0C(){
        this.SetC(this.GetC() + 1);
        this.AddPC(1);
    }
    Op1C(){
        this.SetE(this.GetE() + 1);
        this.AddPC(1);
    }
    Op2C(){
        this.SetL(this.GetL() + 1);
        this.AddPC(1);
    }
    OpC3(){
        this.SetA(this.GetA() + 1);
        this.AddPC(1);
    }
    //XOR
    OpAF(){
        this.SetA(~this.GetA());
        this.AddPC(1);
    }
    //Loading
    Op02(){
        this.SetBC(this.GetA());
        this.AddPC(1);
    }
    
    //Loading
    Op21(){
        this.SetHL((this.GetMemVal(this.GetPC()) << 8) || this.GetMemVal(this.GetPC() + 1));
        this.AddPC(3);
    }

    Op31(){
        this.SetSP((this.GetMemVal(this.GetPC()) << 8) || this.GetMemVal(this.GetPC() + 1))
        this.AddPC(3);
    }
}