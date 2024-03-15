import { uploadImg } from '@/services/api';

// convert file in base64
function getBase64(file: File) {
	return new Promise<string>((resolve, reject) => {
		var reader = new FileReader();
		reader.onload = function () {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(
	b64Data: string,
	contentType: string,
	sliceSize: number = 512
) {
	contentType = contentType || '';

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, { type: contentType });
	return blob;
}

// this is my upload function. I'm converting the base64 to blob for more efficient file
// upload and so it works with my existing file upload processing
// see here for more info on this approach https://ourcodeworld.com/articles/read/322/how-to-convert-a-base64-image-into-a-image-file-and-upload-it-with-an-asynchronous-form-using-jquery
async function b64ToUrl(base64: string | null) {
	if (typeof base64 !== 'string') return '';
	// Split the base64 string in data and contentType
	var block = base64.split(';');
	// Get the content type of the image
	var contentType = block[0].split(':')[1];
	// get the real base64 content of the file
	var realData = block[1].split(',')[1];
	// Convert it to a blob to upload
	var blob = b64toBlob(realData, contentType);
	// create form data
	const fd = new FormData();
	// replace "file_upload" with whatever form field you expect the file to be uploaded to
	fd.append('file', blob);

	const result = await uploadImg(fd);
	console.log('result => ', result);
	return result.data;
}

async function saveToServer(file: File) {
	if (!file) return '';
	// create form data
	const fd = new FormData();
	// replace "file_upload" with whatever form field you expect the file to be uploaded to
	fd.append('file', file);
	const result = await uploadImg(fd);
	return result.data;
}

const TextEditorTools = {
	getBase64,
	saveToServer,
	b64ToUrl,
};
export default TextEditorTools;
