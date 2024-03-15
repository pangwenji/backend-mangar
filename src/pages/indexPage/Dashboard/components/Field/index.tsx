import React from 'react';

import classNames from 'classnames';
import styles from './index.less';

export type FieldProps = {
  label: string;
  value: string;
  rate?: string;
  style?: React.CSSProperties;
};

const Rate: React.FC<{ rate: string }> = ({ rate }) => {
  const isPositive = Number(rate.slice(0, -1)) >= 0;

  return (
    <div className={styles.rate}>
      <span
        className={classNames(styles.icon, isPositive && styles.iconPositive)}
      ></span>
      <span
        className={classNames(styles.text, isPositive && styles.textPositive)}
      >
        {isPositive && '+'}
        {rate}
      </span>
    </div>
  );
};

const Field: React.FC<FieldProps> = ({ label, value, rate, ...rest }) => (
  <div className={styles.field} {...rest}>
    <div className={styles.leftContainer}>
      <span className={styles.label}>{label}</span>
      <span className={styles.number}>{value}</span>
    </div>
    {rate && <Rate rate={rate} />}
  </div>
);

export default Field;
