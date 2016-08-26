angular.module('myAppControllers').controller('checksumCalculatorCtrl', ['$scope',
    function($scope) {

        function padDigits(number, digits) {
                if (digits === undefined) {
                    digits = 8;
                }
                return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
            }

        $scope.calcChecksum = function() {
            console.log($scope.hexInput);
            var input = $scope.hexInput;
            if (input === undefined) {
                return;
            }

            var hexBytes = input.split(" ");

            var hexsum = "0";
            for (var i = 0; i < hexBytes.length; i++) {
                hexsum = (parseInt(hexsum, 16) + parseInt(hexBytes[i], 16)).toString(16);
            }
            console.log(hexsum);

            var checkSumBinaryValue = padDigits(ConvertBase.hex2bin(hexsum),16);
            console.log(checkSumBinaryValue);
            var checksumMSB, checksumLSB;
            checksumMSB = ConvertBase.bin2hex(checkSumBinaryValue.substring(0, 8));
            checksumLSB = ConvertBase.bin2hex(checkSumBinaryValue.substring(checkSumBinaryValue.length - 8));

            $scope.checksumMSB = checksumMSB;
            $scope.checksumLSB = checksumLSB;
            $scope.checkSumHEX = hexsum;
            $scope.checksumLSBDec = ConvertBase.hex2dec(checksumLSB);

            var checksumLSBArray = String(padDigits(ConvertBase.hex2bin(checksumLSB))).split("");
            var checksumLSBComplementArray = [];
            _.each(checksumLSBArray, function(value) {
                            if (value === "0") {
                                checksumLSBComplementArray.push("1");
                            } else {
                                checksumLSBComplementArray.push("0");
                            }
                        });

            $scope.checksumLSBComplement = ConvertBase.bin2hex(checksumLSBComplementArray.join(""));

        }

    }
]);
