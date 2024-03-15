import {
	ProFormUploadButton,
	ProFormUploadButtonProps,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import TextEditorTools from '../TextEditor/tools';

const getBase64 = TextEditorTools.getBase64;

const MyUpload: React.FC<ProFormUploadButtonProps> = ({
	fieldProps,
	...props
}) => {
	const formInstance = useFormInstance();
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	useEffect(() => {
		const initFile = formInstance.getFieldValue(props.name);
		if (initFile && typeof initFile === 'string') {
			setFileList([
				{
					uid: `${Date.now()}`,
					name: initFile.slice(initFile.lastIndexOf('/') + 1),
					status: 'done',
					thumbUrl: initFile,
					url: initFile,
				},
			]);
		}
	}, [formInstance, props.name]);

	const handleCancel = () => setPreviewOpen(false);

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile);
		}
		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
		setPreviewTitle(
			file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
		);
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
		setFileList(newFileList);

	const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
		setFileList([...fileList, file]);
		return false;
	};

	return (
		<>
			<ProFormUploadButton
				max={1}
				transform={(value, name) => {
					return { [name]: [value].flat().filter(Boolean)[0] || '' };
				}}
				{...props}
				fileList={fileList}
				fieldProps={{
					listType: 'picture-card',
					onPreview: handlePreview,
					onChange: handleChange,
					beforeUpload: handleBeforeUpload,
					...fieldProps,
				}}
			/>
			<Modal
				open={previewOpen}
				title={previewTitle}
				footer={null}
				onCancel={handleCancel}
			>
				<img alt='example' style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</>
	);
};

export default MyUpload;
