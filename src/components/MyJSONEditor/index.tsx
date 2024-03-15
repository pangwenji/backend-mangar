import type { JSONEditorOptions } from 'jsoneditor';
import JSONEditor from 'jsoneditor';
import React, { memo, useEffect, useRef } from 'react';

import 'jsoneditor/dist/jsoneditor.css';
import './index.less';

interface IJSONEditorProps extends Omit<JSONEditorOptions, 'onChange'> {
	onChange?: (val: string) => void;
	value?: string;
}

const DefaultOptions: JSONEditorOptions = {
	search: false,
	enableTransform: false,
};

const convertStr2JSON = (val?: string) => {
	let result = {};
	try {
		result = JSON.parse(val?.trim() || '{}');
	} catch {
		result = {};
	}
	return result;
};

const MyJSONEditor: React.FC<IJSONEditorProps> = ({
	value,
	onChange,
	...options
}) => {
	const editor = useRef<JSONEditor>();
	const container = useRef<HTMLDivElement>(null);

	/* 初始化 editor */
	useEffect(() => {
		if (!editor.current && container.current) {
			const jsonEditor = new JSONEditor(
				container.current,
				{
					...DefaultOptions,
					...options,
					onChangeText(jsonString) {
						onChange?.(jsonString);
					},
				},
				convertStr2JSON(value)
			);
			editor.current = jsonEditor;
		}
		return () => {
			if (editor.current) {
				editor.current.destroy();
			}
		};
	}, []);

	return <div className='jsoneditor-react-container' ref={container} />;
};

export default memo(MyJSONEditor);
