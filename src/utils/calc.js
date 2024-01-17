(function () {
    var calc = {
        round: function (arg, d) {
            return Number((arg).toFixed(d))
        },
        /*
         函数，加法函数，用来得到精确的加法结果
         说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
         参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
         调用：Calc.Add(arg1,arg2,d)
         返回值：两数相加的结果
         */
        Add: function (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length
            } catch (e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch (e) {
                r2 = 0
            }
            m = Math.pow(10, Math.max(r1, r2));
            //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m + arg2 * m) / m).toFixed(n);
        },
        Add_m: function (arr, d) {
            var i = 0
            for (i; i < arr.length; i++) {
                if (i > 0) {
                    arr[i] = Calc.Add(arr[i], arr[i - 1])
                }
            }
            var d = arguments[1];
            return typeof d === "number" ? Number((arr[arr.length - 1]).toFixed(d)) : (arr[arr.length - 1]);
        },
        /*
         函数：减法函数，用来得到精确的减法结果
         说明：函数返回较为精确的减法结果。
         参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
         调用：Calc.Sub(arg1,arg2)
         返回值：两数相减的结果
         */
        Sub: function (arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length
            } catch (e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch (e) {
                r2 = 0
            }
            m = Math.pow(10, Math.max(r1, r2));
            //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg1 * m - arg2 * m) / m).toFixed(n);
        },
        /*
         函数：乘法函数，用来得到精确的乘法结果
         说明：函数返回较为精确的乘法结果。
         参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
         调用：Calc.Mul(arg1,arg2)
         返回值：两数相乘的结果
         */
        Mul: function (arg1, arg2) {
            var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
            m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
            resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
            return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
        },
        /*
         函数：除法函数，用来得到精确的除法结果
         说明：函数返回较为精确的除法结果。
         参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
         调用：Calc.Div(arg1,arg2)
         返回值：arg1除于arg2的结果
         */
      Div: function (arg1, arg2, d) {
            var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
            m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
            resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
            return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
      },

    };
    window.Calc = calc;
}());