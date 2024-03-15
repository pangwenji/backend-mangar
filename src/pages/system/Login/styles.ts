import logo from '@/statics/imgs/LOGO.png';
import { cssFunction } from '@ant-design/use-emotion-css';
import { css } from '@emotion/css';

export const getLoginContainerClassName: cssFunction = () => {
	return {
		height: '100%',
		overflowX: 'auto',
		overflowY: 'hidden',
		display: 'flex',
		'.login-page-bg': {
			overflow: 'hidden',
			borderRadius: '0 100px 100px 0',
			position: 'relative',
			width: '40%',
			height: '100%',
			'&::after': {
				content: '""',
				position: 'absolute',
				backgroundImage: `url(${logo})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: '100% auto',
				top: '45%',
				left: '45%',
				width: '40%',
				height: '82px',
				display: 'inline-block',
				transform: 'translate(-50%, -50%)',
			},
		},
	};
};

export const loginFormWrapper = css`
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-inline: 20px;
	.login-form-title {
		width: 410px;
		margin-bottom: 36px;
		h1 {
			margin-bottom: 6px;
		}
	}
	.login-form-footer {
		color: rgba(72, 71, 96, 0.5);
	}
`;

export const loginFormClassName = css`
	display: flex;
	flex-direction: column;
	width: 410px;
	& .ant-input-affix-wrapper {
		padding: 13px 24px;
		line-height: 1;
	}
	& .ant-btn-primary {
		width: 397px;
		height: 54px;
		margin-top: 13px;
		margin-bottom: 62px;
		padding: 10px 8px;
		font-size: 16px;
		border-radius: 16px;
	}
	& .ant-btn-text {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 9em;
		height: 3em;
		padding: 0;
		overflow: hidden;
		font-weight: 600;
		font-size: 16px;
		line-height: 1em;
		letter-spacing: 2px;
		border-radius: 0;
	}
	& .ant-input-group-addon {
		padding: 0;
		overflow: hidden;
	}
	& .ant-form-item .ant-form-item-label > label.ant-form-item-required::before {
		display: none;
	}
	& .ant-form-item .ant-form-item-label > label.ant-form-item-required::after {
		display: inline-block;
		color: #2fafec;
		font-size: 14px;
		line-height: 1;
		visibility: visible;
		content: '*';
		margin-inline-start: 4px;
	}
	& .anticon.ant-input-password-icon {
		color: rgba(72, 71, 96, 0.28);
	}
`;
