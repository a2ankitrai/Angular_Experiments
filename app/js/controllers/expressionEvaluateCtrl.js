angular.module('myAppControllers').controller('expressionEvaluateCtrl', ['$scope',
    function($scope) {

        function evaluate(str, depth) {

            if (depth == undefined) {
                depth = 0;
            } else {
                if (depth >= 10) {
                    console.log("too much recursion");
                    return;
                }
                depth++;
            }

            var unaryOpx = ['HEXDEC', 'HEXBIN', 'BINDEC', 'DECBIN', 'EXP'];
            var ternaryOpx = ['CONDITION'];
            /*  var str = "(HEXDEC[20][0])*(EXP[21][1]) ";*/
            /* var str = "(HEXDEC([6][1] + [6][0])) * (HEXDEC([6][2])) * (EXP(HEXBIN[8][0]))";*/
            //     var str = "(HEXDEC[44][2]) * 0.02 ";
            /* var str = "FLIPBIT(ISNONZERO(HEXDEC[44][1])) -->";*/

            if (!str) {
                str = "{(CONDITION(2, == , 2)) ? " +
                    "{(CONDITION(1, ==, 3)) ? 5 : {(CONDITION(45, ==, 45)) ? 76 : 67}} : {(CONDITION(7, ==, 8)) ? 5 : 23}}";
            }

            var tokens = str.split('');

            var valueStack = new Array();
            var opStack = new Array();

            for (var i = 0; i < tokens.length; i++) {

                if (tokens[i] == ' ')
                    continue;

                if (tokens[i] >= 'A' && tokens[i] <= 'Z') {
                    var opBuffer = '';
                    while (i < tokens.length && tokens[i] >= 'A' && tokens[i] <= 'Z')
                        opBuffer += tokens[i++];
                    opStack.push(opBuffer);
                }

                // Current token is a number, push it to stack for numbers
                if (tokens[i] >= '0' && tokens[i] <= '9') {
                    var valBuffer = '';
                    // There may be more than one digits in number
                    while (i < tokens.length && (tokens[i] >= '0' && tokens[i] <= '9') || tokens[i] == '.')
                        valBuffer += tokens[i++];
                    valueStack.push(valBuffer);
                } else if (tokens[i] == '[') {
                    var valBuffer = '';
                    var endBracketCtr = 0;
                    while (i < tokens.length && endBracketCtr < 2) {
                        valBuffer += tokens[i];
                        if (tokens[i] == ']') {
                            endBracketCtr++;
                        }
                        i++;
                    }
                    valueStack.push(valBuffer);
                }

                // Current token is comparision operator to be used in conditional evaluation
                if (tokens[i] == '=') {
                    var valBuffer = '';
                    var endBracketCtr = 0;
                    while (i < tokens.length && tokens[i] == '=') {
                        valBuffer += tokens[i];
                        i++;
                    }
                    if (valBuffer == '==') {
                        valueStack.push(valBuffer);
                    }
                }

                // Current token is an opening brace, push it to 'opStack'
                if (tokens[i] == '(' || tokens[i] == '{') {
                    opStack.push(tokens[i]);
                }

                // Closing brace encountered, solve entire brace
                if (tokens[i] == ')') {
                    while (opStack[opStack.length - 1] != '(') {
                        processOperation();
                    }
                    opStack.pop();
                }

                if (tokens[i] == '?') {

                    var conditionResult = valueStack.pop();
                    i++;
                    var truthyPath = '',
                        falsyPath = '',
                        truthyNestedCondition = 0,
                        falsyNestedCondition = 0;

                    // reading the truthyPath    
                    while (i < tokens.length) {

                        if (tokens[i] == ":" && truthyNestedCondition == 0) {
                            break;
                        }

                        if (tokens[i] == "{") {
                            truthyNestedCondition++;
                        }

                        if (tokens[i] == '}') {
                            truthyNestedCondition--;
                        }

                        truthyPath += tokens[i++];
                    }

                    i++;

                    //reading the falsyPath
                    while (i < tokens.length) {

                        if (tokens[i] == '{') {
                            falsyNestedCondition++;
                        }

                        if (tokens[i] == '}') {
                            if (falsyNestedCondition == 0) {
                                break;
                            } else {
                                falsyNestedCondition--;
                            }
                        }

                        falsyPath += tokens[i++];
                    }
                    i++;
 
                        if (conditionResult == true) {
                            valueStack.push(evaluate(truthyPath, depth));
                        } else {
                            valueStack.push(evaluate(falsyPath, depth));
                        }                   

                    /* if (value == false) {
                         valueStack.pop();
                         var falsyPath = '';
                         var nestedConditionCounter = 0;
                         while (i < tokens.length) {

                             if (tokens[i] == '{') {
                                 nestedConditionCounter++;
                             }

                             if (tokens[i] == '}') {
                                 if (nestedConditionCounter == 0) {
                                     break;
                                 } else {
                                     nestedConditionCounter--;
                                 }
                             }

                             falsyPath += tokens[i];
                             i++;
                         }
                         opStack.pop();

                         var falsyPathResult = evaluate(falsyPath);
                         valueStack.push(falsyPathResult);
                     } else {
                         while (i < tokens.length && tokens[i] != '}') {
                             i++;
                         }
                     }
                     opStack.pop();*/
                }

                /*if (tokens[i] == ':') {
                    opStack.push(tokens[i]);
                    processOperation();
                    opStack.pop();

                    var value = valueStack[valueStack.length - 1];
                    i++;
                    if (value == false) {
                        valueStack.pop();
                        var falsyPath = '';
                        var nestedConditionCounter = 0;
                        while (i < tokens.length) {

                            if (tokens[i] == '{') {
                                nestedConditionCounter++;
                            }

                            if (tokens[i] == '}') {
                                if (nestedConditionCounter == 0) {
                                    break;
                                } else {
                                    nestedConditionCounter--;
                                }
                            }

                            falsyPath += tokens[i];
                            i++;
                        }
                        opStack.pop();

                        var falsyPathResult = evaluate(falsyPath);
                        valueStack.push(falsyPathResult);
                    } else {
                        while (i < tokens.length && tokens[i] != '}') {
                            i++;
                        }
                    }
                    opStack.pop();
                }*/

                // Current token is a numeric operator.
                if (tokens[i] == '+' || tokens[i] == '*' || tokens[i] == '/') {

                    // While top of 'ops' has same or greater precedence to current
                    // token, which is an operator. Apply operator on top of 'ops'
                    // to top two elements in values stack

                    while (opStack.length != 0 && hasPrecedence(tokens[i], opStack[opStack.length - 1])) {
                        processOperation();
                    }

                    // Push current token to 'opStack'.
                    opStack.push(tokens[i]);
                }

            }

            // Entire expression has been parsed at this point, apply remaining
            // ops to remaining values
            while (opStack.length != 0) {
                processOperation();
            }

            var finalResult = valueStack.pop();

            console.log(finalResult);
            // Top of 'values' contains result, return it
            /*return finalResult;*/

            function processOperation() {
                var operation = opStack.pop();
                if (unaryOpx.indexOf(operation) > -1) {
                    valueStack.push(applyOperation(operation, valueStack.pop(), undefined));
                } else if (ternaryOpx.indexOf(operation) > -1) {
                    valueStack.push(applyOperation(operation, valueStack.pop(), valueStack.pop(), valueStack.pop()));
                } else {
                    valueStack.push(applyOperation(operation, valueStack.pop(), valueStack.pop()));
                }
            }
        }

        function applyOperation(operation, refA, refB, refC) {

            refA = String(refA);
            refB = String(refB);

            /* console.log(operation);
             console.log(refA);
             console.log(refB);*/


            var valueA, valueB, valueC, aIndexArr = [],
                bIndexArr = [];

            if (refA.indexOf('[') > -1 && refA.indexOf(']') > -1) {
                refA.replace(/\[(.*?)\]/g, function($0, $1) { aIndexArr.push($1) });
                valueA = bytesGroupArray[aIndexArr[0] - 1][aIndexArr[1]];
            } else {
                valueA = refA;
            }

            if (refB && refB.indexOf('[') > -1 && refB.indexOf(']') > -1) {
                refB.replace(/\[(.*?)\]/g, function($0, $1) { bIndexArr.push($1) });
                valueB = bytesGroupArray[bIndexArr[0] - 1][bIndexArr[1]];
            } else {
                valueB = refB;
            }

            if (refC != undefined) {
                if (refC.indexOf('[') > -1 && refC.indexOf(']') > -1) {
                    refC.replace(/\[(.*?)\]/g, function($0, $1) { bIndexArr.push($1) });
                    valueC = bytesGroupArray[bIndexArr[0] - 1][bIndexArr[1]];
                } else {
                    valueC = refC;
                }
            }

            if (operation == undefined) {
                return valueA;
            }

            switch (operation) {
                case '+':
                    return '' + valueB + valueA; // Reversing the order of values to match stack popping.
                    break;
                case '*':
                    return parseFloat(valueA) * parseFloat(valueB);
                    break;
                case '/':
                    return parseFloat(valueA) / parseFloat(valueB);
                    break;
                case 'CONCAT':
                    return '' + valueB + valueA;
                    break;
                case 'HEXDEC':
                    return ConvertBase.hex2dec(valueA);
                    break;
                case 'HEXBIN':
                    console.log(padDigits(ConvertBase.hex2bin(valueA), 8));
                    return padDigits(ConvertBase.hex2bin(valueA), 8);
                    break;
                case 'BINDEC':
                    return ConvertBase.bin2dec(valueA);
                    break;
                case 'DECBIN':
                    return ConvertBase.dec2bin(valueA);
                    break;
                case 'PICKBIT':
                    valueB = padDigits(ConvertBase.hex2bin(valueB), 8);
                    console.log(valueB);
                    if (valueA >= 0 && valueA <= 7)
                        return String(valueB).split('')[valueA];
                    else
                        return undefined;
                    break;
                case 'ISNONZERO':
                    return valueA == 0 ? 0 : 1;
                    break;
                case 'FLIPBIT':
                    return valueA == 0 ? 1 : 0;
                    break;
                case 'CONDITION':
                    var conditionResult;
                    switch (valueB) {
                        case '==':
                            if (valueC == valueA) {
                                conditionResult = true;
                            } else {
                                conditionResult = false;
                            }
                            break;
                        default:
                            console.log("default case in condition");
                            break;
                    }
                    return conditionResult;
                    break;
                case ":":
                    if (valueB !== "false") {
                        return valueA;
                    } else {
                        return false;
                    }
                    break;
                case 'EXP':
                    console.log("vaL :" + valueA);
                    var binaryArray = String(valueA).split('');
                    var signValue = binaryArray[0];
                    console.log("signValue: " + signValue);
                    var complementedArray = [];

                    for (i = 0; i < binaryArray.length; i++) {
                        if (binaryArray[i] == '0') {
                            complementedArray.push('1');
                        } else {
                            complementedArray.push('0');
                        }
                    }
                    var complementedNumber = complementedArray.join('');
                    console.log("complementedNumber: " + complementedNumber);


                    var complementedNumberB10 = ConvertBase.bin2dec(complementedNumber);
                    console.log("complementedNumberB10: " + complementedNumberB10)
                    var complementedNumberB10AfterAdd = parseInt(complementedNumberB10) + 1;
                    console.log("complementedNumberB10 after add: " + complementedNumberB10AfterAdd);

                    var calculatedExpValue = undefined;

                    if (signValue == 1) {
                        console.log(1 / (Math.pow(10, complementedNumberB10AfterAdd)));
                        calculatedExpValue = 1 / Math.pow(10, complementedNumberB10AfterAdd);
                        /*console.log(1/(10^(parseInt(complementedNumberB10AfterAdd))));*/
                    } else {
                        console.log(Math.pow(10, complementedNumberB10AfterAdd));
                        calculatedExpValue = Math.pow(10, complementedNumberB10AfterAdd);
                    }
                    return calculatedExpValue;
                    break;
                default:
                    return undefined;
            }

        }

        // Returns true if 'op2' has higher or same precedence as 'op1',
        // otherwise returns false.
        function hasPrecedence(op1, op2) {
            if (op2 == '(' || op2 == ')')
                return false;
            if ((op1 == '*' || op1 == '/') && (op2 == '+' || op2 == '-'))
                return false;
            else
                return true;
        }

        var hexData = "3d 10 8a 10 8b 00 ff ff ff fe ff ff ff 03 0e 76 02 32 28 64 05 fe 14 03 " +
            "28 14 f0 0a 32 05 ff 14 01 02 02 32 01 ff 00 1e 0f 8c 05 ff 03 1e 0a c8 " +
            "05 fe 00 28 14 8c 05 ff 01 28 18 64 01 fe 01 1e 0a 32 05 fe 00 00 00 00 " +
            "64 02 00 00 00 00 00 00 00 00 00 00 00 fe 26 00 00 00 00 00 00 32 00 00 " +
            "00 00 00 0a 00 00 00 00 1c 78 c0 12 00 00 1e 00 00 1e 00 00 1e 00 00 1e " +
            "00 00 3c 00 00 1e 00 00 1e 00 00 1e 00 00 00 00 00 00 00 00 00 00 00 00 " +
            "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 0f 2c 00 " +
            "00 00 01 1e 00 00 00 00 00 00 00 00 00 00 00 97 1b 68";

        var hexBytes = hexData.split(" ");
        var bytesGroupArray = [];
        var bytesGroupIndex = 0;

        _.each(hexBytes, function(byte, index) {

            if (bytesGroupArray[bytesGroupIndex]) {
                bytesGroupArray[bytesGroupIndex].push(byte);
            } else {
                bytesGroupArray[bytesGroupIndex] = [];
                bytesGroupArray[bytesGroupIndex].push(byte);
            }

            if ((index + 1) % 3 == 0) {
                bytesGroupIndex++;
            }
        });
        console.log(bytesGroupArray);

        function padDigits(number, digits) {
            return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
        }

        evaluate();

    }
]);
