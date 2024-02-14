import classNames from 'classnames';
import inputCls from './Input.module.scss';

export default function Input({
  type, className, placeholder, id,
}) {
  const inputType = type || 'text';

  return (
    <input
      type={inputType}
      className={classNames(className, inputCls.input)}
      placeholder={placeholder}
      id={id}
    />
  );
}