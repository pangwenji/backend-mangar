import ProForm from '@ant-design/pro-form';
import BlotFormatter from 'quill-blot-formatter';
import ImageUploader from 'quill-image-uploader';
import ReactQuill, { Quill } from 'react-quill';

import type { ProFormItemProps } from '@ant-design/pro-form';
import type { ReactQuillProps } from 'react-quill';
import { IndentStyle } from './customStyles';

import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import 'react-quill/dist/quill.snow.css';
import './index.less';
import TextEditorTools from './tools';

Quill.register('modules/imageUploader', ImageUploader);
Quill.register('modules/blotFormatter', BlotFormatter);

/* 
[
    "attributors/style/align",
    "attributors/style/background",
    "attributors/style/color",
    "attributors/style/direction",
    "attributors/style/font",
    "attributors/style/size"
]
*/
const BackgroundStyle = Quill.import('attributors/style/background');
const ColorStyle = Quill.import('attributors/style/color');
const SizeStyle = Quill.import('attributors/style/size');
const AlignStyle = Quill.import('attributors/style/align');
const FontStyle = Quill.import('attributors/style/font');
const DirectionStyle = Quill.import('attributors/style/direction');

const fontSizeArr = [
	'8px',
	'9px',
	'10px',
	'12px',
	'14px',
	'16px',
	'20px',
	'24px',
	'32px',
	'42px',
	'54px',
	'68px',
	'84px',
	'98px',
];
SizeStyle.whitelist = fontSizeArr;

Quill.register(BackgroundStyle, true);
Quill.register(ColorStyle, true);
Quill.register(SizeStyle, true);
Quill.register(AlignStyle, true);
Quill.register(FontStyle, true);
Quill.register(DirectionStyle, true);
Quill.register(IndentStyle, true);

const toolbarOptions = [
	[{ size: SizeStyle.whitelist }, 'bold', 'italic', 'underline', 'strike'], // toggled buttons
	[{ header: '1' }, { header: '2' }, { header: '2' }],
	// ['blockquote', 'code-block'],
	/* [
    { header: [1, 2, 3, 4, 5, 6, false] },
   { size: SizeStyle.whitelist }], */
	[{ color: [] }, { background: [] }], // dropdown with defaults from theme
	[{ align: [] }],
	[{ script: 'sub' }, { script: 'super' }],
	[{ list: 'ordered' }, { list: 'bullet' }],
	[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
	['image'],
	['clean'], // remove formatting button
].flat();

const blotFormatter = {};
const imageUploader = {
	upload: async (file: File) => {
		const base64 = await TextEditorTools.getBase64(file);
		if (base64 && base64.length <= 100) {
			return base64;
		} else {
			return TextEditorTools.saveToServer(file);
		}
	},
};

interface ITextEditorProps extends Omit<ReactQuillProps, 'onChange' | 'value'> {
	onChange?: (content: any) => void;
	value?: string;
}

const htmlToDelta = (html: string = '') => {
	const div = document.createElement('div');
	div.setAttribute('id', 'htmlToDelta');
	div.innerHTML = `<div id="quillEditor" style="display:none">${html}</div>`;
	document.body.appendChild(div);
	const quill = new Quill('#quillEditor', {
		theme: 'snow',
	});
	const delta = quill.getContents();
	document.getElementById('htmlToDelta')?.remove();
	return delta;
};

export const TextEditor: React.FC<ITextEditorProps> = ({
	onChange,
	value = '',
	modules,
	...props
}) => {
	return (
		<ReactQuill
			{...props}
			defaultValue={htmlToDelta(value)}
			onChange={(content) => {
				onChange?.(content);
			}}
			modules={{
				toolbar: toolbarOptions,
				blotFormatter: props.readOnly ? undefined : blotFormatter,
				imageUploader,
				...modules,
			}}
		/>
	);
};

export const FormTextEditor: React.FC<
	ProFormItemProps & { textEditorProps?: ITextEditorProps }
> = ({ textEditorProps, ...props }) => {
	return (
		<ProForm.Item wrapperCol={{ span: 24 }} {...props}>
			<TextEditor className='my-editor' {...textEditorProps} />
		</ProForm.Item>
	);
};
