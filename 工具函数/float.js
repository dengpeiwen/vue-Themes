
	// 乘法
	const floatMultiply = (arg1, arg2) => {
		if (arg1 == null || arg2 == null) {
			return null;
		}

		let n1,n2;
		let r1, r2; // 小数位数

		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}

		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}

		n1 = Number(arg1.toString().replace(".", ""));
		n2 = Number(arg2.toString().replace(".", ""));
		// console.log(n1 * n2 / Math.pow(10, r1+r2))
		return n1 * n2 / Math.pow(10, r1+r2);
	}

	// 加法
	const floatAdd = (arg1, arg2) => {
		let r1, r2, m;

		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}

		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}

		m = Math.pow(10, Math.max(r1, r2));
		// console.log((floatMultiply(arg1 , m) + floatMultiply(arg2 , m)) / m)
		return (floatMultiply(arg1 , m) + floatMultiply(arg2 , m)) / m;
	}

	// 减法
	const floatSub = (arg1, arg2) => {
		let r1, r2, m, n;

		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}

		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}

		m = Math.pow(10, Math.max(r1, r2));
		// 动态控制精度长度
		n = (r1 >= r2) ? r1 : r2;

		return ((floatMultiply(arg1 , m) - floatMultiply(arg2 , m)) / m).toFixed(n);
	}

	// 除法

	const floatDivide = (arg1, arg2) => {

		if (arg1 == null) {
			return null;
		}
		if (arg2 == null || arg2 == 0) {
			return null;
		}

		let n1,n2;
		let r1, r2; // 小数位数

		try {
			r1 = arg1.toString().split(".")[1].length;
		} catch (e) {
			r1 = 0;
		}

		try {
			r2 = arg2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}

		n1 = Number(arg1.toString().replace(".", ""));
		n2 = Number(arg2.toString().replace(".", ""));
	  // console.log((n1 / n2) * Math.pow(10, r2 - r1))
		return (n1 / n2) * Math.pow(10, r2 - r1);
	}

	export default {
		floatMultiply,
		floatAdd,
		floatSub,
		floatDivide
	}
