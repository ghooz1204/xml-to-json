const getModifiersFromKeyCode = (modifiers, os = 'windows') => {
    let control = "";
    if (os === 'windows') {
        control = "control";
    } else {
        control = "command";
    }

    switch (modifiers) {
        case "1": return [];
        case "2": return [control];
        case "3": return [control, "shift"];
        case "4": return ["alt"];
        case "5": return ["shift"];
        case "6": return [control, "alt"];
        case "7": return [control, "shift", "alt"];
        case "8": return ["shift", "alt"];
        default: return [];
    }
}

const getKeysFromKeyCode = (keys, os = 'windows') => {
    switch (keys) {
        case "9": return "tab";
        case "13": return "enter";
        case "19": return "pause";
        case "27": return "escape";
        case "32": return "space";
        case "33": return "pageup";
        case "34": return "pagedown";
        case "35": return "end";
        case "36": return "home";
        case "37": return "left";
        case "38": return "up";
        case "39": return "right";
        case "40": return "down";
        case "34": return "printscreen";
        case "45": return "insert";
        case "46": return "delete";

        case "48": return "0";
        case "49": return "1";
        case "50": return "2";
        case "51": return "3";
        case "52": return "4";
        case "53": return "5";
        case "54": return "6";
        case "55": return "7";
        case "56": return "8";
        case "57": return "9";
        
        case "65": return "a";
        case "66": return "b";
        case "67": return "c";
        case "68": return "d";
        case "69": return "e";
        case "70": return "f";
        case "71": return "g";
        case "72": return "h";
        case "73": return "i";
        case "74": return "j";
        case "75": return "k";
        case "76": return "l";
        case "77": return "m";
        case "78": return "n";
        case "79": return "o";
        case "80": return "p";
        case "81": return "q";
        case "82": return "r";
        case "83": return "s";
        case "84": return "t";
        case "85": return "u";
        case "86": return "v";
        case "87": return "w";
        case "88": return "x";
        case "89": return "y";
        case "90": return "z";

        case "96": return "numpad_0";
        case "97": return "numpad_1";
        case "98": return "numpad_2";
        case "99": return "numpad_3";
        case "100": return "numpad_4";
        case "101": return "numpad_5";
        case "102": return "numpad_6";
        case "103": return "numpad_7";
        case "104": return "numpad_8";
        case "105": return "numpad_9";


        case "112": return "f1";
        case "113": return "f2";
        case "114": return "f3";
        case "115": return "f4";
        case "116": return "f5";
        case "117": return "f6";
        case "118": return "f7";
        case "119": return "f8";
        case "120": return "f9";
        case "121": return "f9";
        case "122": return "f10";
        case "123": return "f12";
        case "124": return "f13";
        case "125": return "f14";
        case "126": return "f15";
        case "127": return "f16";
        case "128": return "f17";
        case "129": return "f18";
        case "130": return "f19";
        case "131": return "f20";
        case "132": return "f21";
        case "133": return "f22";
        case "134": return "f23";
        case "135": return "f24";

        case "186": return ";";
        case "187": return "=";
        case "188": return ",";
        case "189": return "-";
        case "190": return ".";
        

        case "219": return "[";
        case "221": return "]";
        case "222": return "'";
        default: return keys;
    }
}

const makeETypeFCode = (executeType, messageType, actionType, typeKey, keycode, multi, isDial) => {
    let etype = "", fcode = {};
    if (executeType === "sendScript") {
        etype = "sendCepScript";
        fcode = {
            messageType,
            actionType,
            typeKey
        }
    } else {
        if (isDial) {
            etype = "sendDialKeyboards";
            fcode = {
                rotate: {
                    left: {
                        keys: [getKeysFromKeyCode(keycode.left)],
                        modifiers: getModifiersFromKeyCode(multi.left)
                    },
                    right: {
                        keys: [getKeysFromKeyCode(keycode.right)],
                        modifiers: getModifiersFromKeyCode(multi.right)
                    },
                }
            }
        } else {
            etype = "sendKeyboards";
            fcode = {
                keys: [getKeysFromKeyCode(keycode)],
                modifiers: getModifiersFromKeyCode(multi)
            }
        }
    }
    return {
        etype,
        fcode
    }
}

const propertyFormatter = (property, isDial = true) => {
    if (isDial) {
        const { formName: fname, excuteType, messageType, actionType, typeKey, keycode1, keycode2, multi1, multi2 } = property;
        const { etype, fcode } = makeETypeFCode(excuteType, messageType, actionType, typeKey, { left: keycode1, right: keycode2 }, { left: multi1, right: multi2 }, isDial);
        return { fname, etype, fcode }
    }
    const { formName: fname, excuteType, messageType, actionType, typeKey, keyCode, multi } = property;
    const { etype, fcode } = makeETypeFCode(excuteType, messageType, actionType, typeKey, keyCode, multi, isDial);
    return { fname, etype, fcode }
}

const fs = require('fs');
const convert = require('xml-js');

const APP_NAME = 'PremierePro';
// const TYPE = 'rotate';
// const TYPE = 'press'


const FILE_PATH = './data/' + APP_NAME + '/';
// const file = fs.readFileSync(FILE_PATH + TYPE + '.xml', 'utf8');
const rotateFile = fs.readFileSync(FILE_PATH + 'rotate.xml', 'utf8');
const pressFile = fs.readFileSync(FILE_PATH + 'press.xml', 'utf8');

const OPTION = {
    compact: true,
    ignoreComment: true,
    ignoreDoctype: true,
    // ignoreAttributes: true,
};

// if (TYPE === 'rotate') {
    const rotateOriginal = JSON.parse(convert.xml2json(rotateFile, OPTION));
    const rotateCategories = rotateOriginal[APP_NAME.toLowerCase()]['rotate'].category;

    const new_rotate_categories = rotateCategories.map(({ _attributes, rotateName }) => {
        return {
            category: _attributes.category_name,
            properties: Array.isArray(rotateName) ?
            rotateName.map(({ _attributes: property }) => propertyFormatter(property, true))
            : [rotateName].map(({ _attributes: property }) => propertyFormatter(property, true))
        };
    });
    fs.writeFileSync(FILE_PATH + 'dial.json', JSON.stringify(new_rotate_categories, null, 4))
// } else {

    const pressOriginal = JSON.parse(convert.xml2json(pressFile, OPTION));
    const pressCategories = pressOriginal[APP_NAME.toLowerCase()]['press'].category;

    const new_press_categories = pressCategories.map(({ _attributes, toolName }) => {
        return {
            category: _attributes.category_name,
            properties: Array.isArray(toolName) ?
            toolName.map(({ _attributes: property }) => propertyFormatter(property, false))
            : [toolName].map(({ _attributes: property }) => propertyFormatter(property, false))
        };
    });
    fs.writeFileSync(FILE_PATH + 'button.json', JSON.stringify(new_press_categories, null, 4))
// }
