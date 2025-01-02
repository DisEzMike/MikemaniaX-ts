import axios from 'axios';
import fs from 'fs';
import { Jimp } from 'jimp';
const qrCodeReader = require('qrcode-reader');
const testFile = async () => {
	try {
		const branchId = '36657';
		const apiKey = 'SLIPOKSUNYQYE';
		const path = __dirname + '/temp/temp.jpg';
    const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));
    const writer = fs.createWriteStream(path);
		const resp = await axios.get('https://sandbox.mikenatcavon.com/api/01.jpg', {
			responseType: 'stream',
		});
    resp.data.pipe(writer);
    await delay(100);
		const buffer = fs.readFileSync(path);
		const image = await Jimp.read(buffer);
		const qrCodeInstance = new qrCodeReader();

		qrCodeInstance.callback = function (err: any, value: any) {
			if (err) {
				console.error(err);
			}
			// __ Printing the decrypted value __ \\
			console.log(value.result);

			fs.unlinkSync(path);
		};

		qrCodeInstance.decode(image.bitmap);

		// const res = await axios.post(
		//   `https://api.slipok.com/api/line/apikey/${branchId}`,
		//   {
		//     files: buffer,
		//     log: true,
		//     // amount: number, // Add this to check with amount of the slip
		//   },
		//   {
		//     headers: {
		//       "x-authorization": apiKey,
		//       "Content-Type": "multipart/form-data",
		//     },
		//   }
		// );
		// // Handle success slip
		// const slipData = res.data.data;
		// console.log(slipData);
	} catch (err) {
		// Handle invalid slip
		if (axios.isAxiosError(err)) {
			const errorData = (err as any).response.data;
			console.log(errorData.code); // Check error code
			console.log(errorData.message); // Check error message
			return;
		}
		console.log(err);
	}
};

testFile();
